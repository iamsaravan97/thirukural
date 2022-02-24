import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Categories } from 'src/app/model/categories';
import { FilterListDto } from 'src/app/model/filterlis';
import { KuralService } from 'src/app/service/kural.service';

interface CategoryNode {
  category?: Categories;
  name: string;
  id?: number;
  children?: CategoryNode[];
  selected?: boolean;
  indeterminate?: boolean;
  parent?: CategoryNode;
  expandable?: boolean;
  level?: number;
  ischildloaded?: boolean;
}

@Component({
  selector: 'app-category-tree-filter',
  templateUrl: './category-tree-filter.component.html',
  styleUrls: ['./category-tree-filter.component.css']
})
export class CategoryTreeFilterComponent implements OnInit {
  tempdtasrc: Array<any>;

  ngOnInit(): void {

  }

  public treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  public _dataSource = new MatTreeNestedDataSource<CategoryNode>();

  public get dataSource() {
    return this._dataSource;
  }
  public set dataSource(val: any) {
    this._dataSource = val;
  }
  @ViewChild('outputDiv', { static: false })
  public outputDivRef: ElementRef<HTMLParagraphElement>;

  hasChild = (_: number, _nodeData: CategoryNode) => _nodeData.expandable;


  constructor(private kuralService: KuralService) {

    this.getinitialrootsections();

  }


  getinitialrootsections() {
    this.tempdtasrc = this.dataSource.data;
    this.kuralService.getAllSections().subscribe({
      next: (sections: Array<Categories>) => {

        sections.forEach(x => {
          this.tempdtasrc.push(<CategoryNode>{
            id: x.Id,
            name: x.Name,
            category: x,
            expandable: true,
            level: 0,
            ischildloaded: false
          })
        })
        this.dataSource.data = this.tempdtasrc

        Object.keys(this.dataSource.data).forEach(key => {
          this.setParent(this.dataSource.data[key], null);
        });

      }
    })
  }

  getKuralsByLevel(node: CategoryNode) {
    this.kuralService.getSectionsByLevel(node.category.Id, node.level).subscribe({
      next: (result: Categories[]) => {
        node.ischildloaded = true;
        if (node.level == 0) {
          if (node.selected) {
            this.filterList.SectionIds = this.filterList.SectionIds.filter(x => x !== node.id);
          }
          this.tempdtasrc.map((existcat: CategoryNode) => {
            if (existcat.name == node.name) {
              existcat.children = [];
              result.forEach(x => {
                existcat.children.push(<CategoryNode>{
                  id: x.Id,
                  name: x.Name,
                  category: x,
                  expandable: true,
                  level: node.level + 1,
                  parent: existcat,
                  selected: node.selected,
                  ischildloaded: false
                });
                if (node.selected) {
                  if (this.filterList.SubSectionIds.indexOf(x.Id) == -1)
                    this.filterList.SubSectionIds.push(x.Id);
                }
              });

            }
          });
        }
        else if (node.level == 1) {
          var parent: CategoryNode[] = this.tempdtasrc.filter(x => x.name == node.parent.name);
          var subcateogry: CategoryNode[] = parent[0].children.filter(x => x.name == node.name);
          if (node.selected) {
            this.filterList.SubSectionIds = this.filterList.SubSectionIds.filter(x => x !== node.id);
          }
          subcateogry[0].children = [];
          result.forEach(x => {
            subcateogry[0].children.push(<CategoryNode>{
              id: x.Id,
              name: x.Name,
              category: x,
              expandable: false,
              level: node.level + 1,
              parent: subcateogry[0],
              selected: node.selected,
              ischildloaded: false
            });
            if (node.selected) {
              if (this.filterList.ChapterIds.indexOf(x.Id) == -1)
                this.filterList.ChapterIds.push(x.Id);
            }
          });
        }
        this.dataSource.data = [];
        this.dataSource.data = this.tempdtasrc
      }
    });
  }

  public isExpandable = (node: CategoryNode) => node.expandable;

  private setParent(node: CategoryNode, parent: CategoryNode) {
    node.parent = parent;
    if (node.children) {
      node.children.forEach(childNode => {
        this.setParent(childNode, node);
      });
    }
  }

  private checkAllParents(node: CategoryNode) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.selected =
        descendants.every(child => child.selected);
      node.parent.indeterminate =
        descendants.some(child => child.selected);
      this.checkAllParents(node.parent);
    }
  }


  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: CategoryNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return child.selected
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CategoryNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => child.selected);
    return result && !this.descendantsAllSelected(node);
  }

  public filterNode(node: CategoryNode, isSelected: boolean) {
    if (isSelected) {
      switch (node.level) {
        case 0: {
          //root section
          //if root section is selected and children are expanded, then empty the sectionid and select all the subsections id a
          //if root section is selected and children are not expaned, then push the section id in the list
          if (this.treeControl.isExpanded(node)) {
            var parentnode: CategoryNode = this.dataSource.data.filter(x => x.name == node.name);
            this.filterList.SectionIds = this.filterList.SectionIds.filter(x => x !== node.id);
            parentnode[0]?.children.forEach(x => {
              if (x.children) {
                x.children.forEach(child => {
                  if (this.filterList.ChapterIds.indexOf(child.id) == -1)
                    this.filterList.ChapterIds.push(child.id);
                });
              } else {
                if (this.filterList.SubSectionIds.indexOf(x.id) == -1)
                  this.filterList.SubSectionIds.push(x.id);
              }
            })
          } else {
            if (this.filterList.SectionIds.indexOf(node.id) == -1)
              this.filterList.SectionIds.push(node.id);
          }
          break;
        }

        case 1: {
          //subsection
          //if sub section is selected and children are expanded, then empty the subsectionid and select all the category id
          //if sub section is selected and children are not expaned, then push the subsection id in the list

          var parentnode: CategoryNode = this.dataSource.data.filter(x => x.name == node.parent.name);
          var subcateogry: CategoryNode[] = parentnode[0].children.filter(x => x.name == node.name);

          if (this.treeControl.isExpanded(node)) {

            subcateogry[0]?.children.forEach(x => {
              if (this.filterList.ChapterIds.indexOf(x.id) == -1)
                this.filterList.ChapterIds.push(x.id);
            })
          } else {

            if (this.filterList.SubSectionIds.indexOf(node.id) == -1)
              this.filterList.SubSectionIds.push(node.id);
          }
          break;
        }
        case 2: {

          if (this.filterList.SubSectionIds.indexOf(node.id) == -1)
            this.filterList.ChapterIds.push(node.id);
          break;
        }
      }
    } else {
      switch (node.level) {
        case 0: {

          //if root section is not selected and children are expanded, then empty the sectionid and all subsections id and all the cateogry id
          //if root section is not selcted and children are not expaned, then empty the section id in the list



          if (this.treeControl.isExpanded(node)) {
            this.filterList.SectionIds = this.filterList.SectionIds.filter(x => x !== node.id);
            var parentnode: CategoryNode = this.dataSource.data.filter(x => x.name == node.name);
            parentnode[0]?.children.forEach(y => {
              this.filterList.SubSectionIds = this.filterList.SubSectionIds.filter(x => x !== y.id);
              if (y.children) {
                y.children.forEach(child => {
                  this.filterList.ChapterIds = this.filterList.ChapterIds.filter(x => x !== child.id);
                })
              }

            })
          } else {
            this.filterList.SectionIds = this.filterList.SectionIds.filter(x => x !== node.id)
          }
          break;
        }
        case 1: {
          //subsection
          //if sub section is not selected and children are expanded, then empty the subsectionid and all the category id
          //if sub section is not selected and children are not expaned, then empty the category id in the list
          var parentnode: CategoryNode = this.dataSource.data.filter(x => x.name == node.parent.name);
          var subcateogry: CategoryNode[] = parentnode[0].children.filter(x => x.name == node.name);

          if (this.treeControl.isExpanded(node)) {

            subcateogry[0]?.children.forEach(y => {
              this.filterList.ChapterIds = this.filterList.ChapterIds.filter(x => x !== y.id);
            })
          } else {
            this.filterList.SubSectionIds = this.filterList.SubSectionIds.filter(x => x !== node.id)
          }
          break;
        }
        case 2: {

          this.filterList.ChapterIds = this.filterList.ChapterIds.filter(x => x !== node.id)
          break;
        }
      }

    }
    this.changeFilterValue();
  }


  private itemToggle(checked: boolean, node: CategoryNode) {
    node.selected = checked;
    this.filterNode(node, node.selected);

    if (node.children) {
      node.children.forEach(child => {
        child.selected = checked;
        if (child.children) {
          child.children.forEach(x => {
            x.selected = checked;
          });
        }
      });
    }
    this.checkAllParents(node);
  }

  loadtree: boolean = true;

  public ChangeNode(node: CategoryNode, isexpanded: boolean) {
    this.tempdtasrc = this.dataSource.data;

    if (isexpanded) {
      if (!node.ischildloaded)
        this.getKuralsByLevel(node);
    } else {
    }
  }


  @Output() onChangeFilter = new EventEmitter<FilterListDto>();

  filterList: FilterListDto = {
    Id: 0,
    ChapterIds: [],
    SectionIds: [],
    SubSectionIds: [],
    PageNumber: 0,
    PageSize: 0
  }

  changeFilterValue() {
    this.onChangeFilter.emit(this.filterList);
  }


}
