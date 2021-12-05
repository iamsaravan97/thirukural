import { Component, OnInit } from '@angular/core';
import { ITreeOptions, TreeModel } from '@circlon/angular-tree-component';
import { Categories } from 'src/app/model/categories';
import { TreeViewModel } from 'src/app/model/treeviewmodel';
import { KuralService } from 'src/app/service/kural.service';

@Component({
  selector: 'app-poc-tree-filter',
  templateUrl: './poc-tree-filter.component.html',
  styleUrls: ['./poc-tree-filter.component.css']
})


export class PocTreeFilterComponent implements OnInit {




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
    let level = data.level

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
    console.log(event);
  }

  deselectnode(event:any){
    console.log(event);
  }
}
