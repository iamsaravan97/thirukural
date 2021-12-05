import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ITreeOptions, ITreeState, TreeModel, TreeNode } from '@circlon/angular-tree-component';
import { Categories } from 'src/app/model/categories';
import { TreeViewModel } from 'src/app/model/treeviewmodel';
import { KuralService } from 'src/app/service/kural.service';

@Component({
  selector: 'app-poc-tree-filter',
  templateUrl: './poc-tree-filter.component.html',
  styleUrls: ['./poc-tree-filter.component.css']
})


export class PocTreeFilterComponent implements OnInit {
  
  
  isParentselected: boolean = false;

  sectionIds : Array<any> = [];

  get state() {
    return localStorage.treeState && JSON.parse(localStorage.treeState);
  }
  set state(state) {
    localStorage.treeState = JSON.stringify(state);
  }

  loadtreeview: boolean = false;

  get nodes() {
    return this.ndes;
  }
  set nodes(value) {
    this.ndes = value;

  }

  ndes: any[] = [];


  constructor(private kuralService: KuralService) {
    this.getinitialrootsections();
  }


  ngOnInit(): void {
  }

  options: ITreeOptions = {
    getChildren: this.getChildren.bind(this),
    useCheckbox: true
  };


  getinitialrootsections() {
    this.kuralService.getAllSections().subscribe({
      next: (sections: Array<Categories>) => {
        this.loadtreeview = false;
        sections.forEach(x => {
          this.nodes.push({
            name: x.Name,
            level: 0,
            sectionid: x.Id,
            hasChildren: true,
          });
        })
        this.loadtreeview = true;
      }
    })
  }


  getChildren(node) {

    let data: any = node.data;
    let level = data.level;
    this.isParentselected = node.isSelected;

    return new Promise((resolve, reject) => {
      this.kuralService.getSectionsByLevel(data.sectionid, level).subscribe({
        next: (result: Categories[]) => {
          const newNodes: any[] = [];
          result.forEach(x => {
            newNodes.push({
              name: x.Name,
              level: level+1,
              sectionid: x.Id
            });
          });

          newNodes.forEach(x=>{
            if(level == 0) x.hasChildren=true;
            else x.hasChildren=false;
          })
          resolve(newNodes);
        }
      });

    });

  }


  selectnode(event:any){
    let node : TreeNode = event.node;
    let data  = node.data

    //case 1 : simply select the root node
    if(node.isSelected && node.level == 1){
      this.sectionIds.push(data.sectionid);
      this.changeFilterValue(data.level,this.sectionIds);
    }


   
  }

  deselectnode(event:any){
    let node : TreeNode = event.node;
    let data  = node.data

       //case 1 : simply unselect the root node
    if(!node.isSelected && node.level == 1){
     this.sectionIds =  this.sectionIds.filter(x=> x != data.sectionid );
      this.changeFilterValue(data.level,this.sectionIds);
    }

  
  }

  
  @Output() onChangeFilter = new EventEmitter<any>();  

  changeFilterValue(level : number,ids : Array<number>){
    let filter = {
      level : level,
      ids : ids
    }
    
    this.onChangeFilter.emit(filter);
  }

}
