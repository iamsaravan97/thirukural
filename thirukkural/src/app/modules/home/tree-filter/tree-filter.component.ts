import { CollectionViewer, DataSource, SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categories } from 'src/app/model/categories';
import { FilterDto } from 'src/app/model/filterdto';
import { Kural } from 'src/app/model/kural';
import { KuralService } from 'src/app/service/kural.service';

/** Flat node with expandable and level information */
export class FilterNode {
  constructor(
    public item: Categories,
    public level = 1,
    public expandable = false,
    public isLoading = false,
  ) {}
}



/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
 export class CategoryDataSource implements DataSource<FilterNode> {
  dataChange = new BehaviorSubject<FilterNode[]>([]);

  get data(): FilterNode[] {
    return this.dataChange.value;
  }
  set data(value: FilterNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<FilterNode>,
    private _kuralService : KuralService
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<FilterNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        (change as SelectionChange<FilterNode>).added ||
        (change as SelectionChange<FilterNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<FilterNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<FilterNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: FilterNode, expand: boolean) {
    node.isLoading = true;
    this._kuralService.getSectionsByLevel(node.item.Id,node.level).subscribe({
      next : (result : Categories[])=>{
        const children = result;
        const index = this.data.indexOf(node);
        if (!children || index < 0) {
          // If no children, or cannot find the node, no op
          return;
        }
  
        setTimeout(() => {
          if (expand) {
            const nodes = children.map(
              name => new FilterNode(name, node.level + 1,node.level>=1?false:true),
            );
            this.data.splice(index + 1, 0, ...nodes);
          } else {
            let count = 0;
            for (
              let i = index + 1;
              i < this.data.length && this.data[i].level > node.level;
              i++, count++
            ) {}
            this.data.splice(index + 1, count);
          }
    
          // notify the change
          this.dataChange.next(this.data);
          node.isLoading = false;
        }, 1000);
      }
    });
  }
}


 
@Component({
  selector: 'app-tree-filter',
  templateUrl: './tree-filter.component.html',
  styleUrls: ['./tree-filter.component.css']
})
export class TreeFilterComponent{

  constructor(private kuralService : KuralService) {
    this.treeControl = new FlatTreeControl<FilterNode>(this.getLevel, this.isExpandable);
    this.dataSource = new CategoryDataSource(this.treeControl,kuralService);
   // this.dataSource.data = database.initialData();
    this.getinitialrootsections();
  }

  getinitialrootsections(){
    this.kuralService.getAllSections().subscribe({
     next : (sections : Array<Categories>) =>{
       this.dataSource.data =  sections.map(section => new FilterNode(section, 0, true));
     }
   })
 }
 
  treeControl: FlatTreeControl<FilterNode>;

  dataSource: CategoryDataSource;

  getLevel = (node: FilterNode) => node.level;

  isExpandable = (node: FilterNode) => node.expandable;

  hasChild = (_: number, _nodeData: FilterNode) => _nodeData.expandable;

  checklistSelection = new SelectionModel<FilterNode>(true /* multiple */);


  //#region  filter selction methd
  checkRootNodeSelection(node: FilterNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  checkAllParentsSelection(node: FilterNode): void {
    let parent: FilterNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

    /* Get the parent node of a node */
    getParentNode(node: FilterNode): FilterNode | null {
      const currentLevel = this.getLevel(node);
      if (currentLevel < 1) {
        return null;
      }
      const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
      for (let i = startIndex; i >= 0; i--) {
        const currentNode = this.treeControl.dataNodes[i];
        if (this.getLevel(currentNode) < currentLevel) {
          return currentNode;
        }
      }
      return null;
    }
  
    /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FilterNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FilterNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FilterNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: FilterNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }


  

  @Output() onChangeFilter = new EventEmitter<FilterDto>();  

  changeFilterValue(node : any){
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    let filterdto = <FilterDto>{
      category : node.item,
      level : node.level
    }
    this.onChangeFilter.emit(filterdto);
  }

  //#endregion




}
