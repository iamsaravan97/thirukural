import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categories } from 'src/app/model/categories';
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





}
