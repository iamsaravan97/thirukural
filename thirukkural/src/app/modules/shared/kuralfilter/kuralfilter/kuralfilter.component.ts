import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Categories } from 'src/app/model/categories';
import { KuralService } from 'src/app/service/kural.service';

@Component({
  selector: 'app-kuralfilter',
  templateUrl: './kuralfilter.component.html',
  styleUrls: ['./kuralfilter.component.css']
})
export class KuralfilterComponent implements OnInit {

  //#region declaration
  trans_categories : string = "அதிகாரங்கள்"
  trans_sections : string = "பால்கள்"
  trans_subsections : string = "இயல்கள்"
  panelOpenState : boolean = false;
  //#endregion

    //#region  subscription
    subscriptions : Subscription[] =[];
    //#endregion

    //#region kural properties
    categories : Array<Categories>=[];
    sections : Array<Categories>=[];
    subsections : Array<Categories>=[];
    //#endregion

  constructor(private _kuralservice: KuralService) {
    this.loadAllChapters();
    this.loadAllSections();
     this.loadAllSubSections();
   }

  ngOnInit(): void {
  }

  //#region categories
  loadAllChapters(){
    this.categories = [];
    let subscrition = this._kuralservice.getAllChapters().subscribe({
      next : (res : Array<Categories>)=>{
        console.log(res);
        if(res != null){
          this.categories = [...res];
        }
      },
      error : (error)=>{
        console.log(error);
      }

    })
    this.subscriptions.push(subscrition);
  }

  loadAllSections(){
    this.sections = [];
    let subscrition = this._kuralservice.getAllSections().subscribe({
      next : (res : Array<Categories>)=>{
        if(res != null){
          this.sections = [...res];
        }
      },
      error : (error)=>{
        console.log(error);
      }

    })
    this.subscriptions.push(subscrition);
  }

  loadAllSubSections(){
    this.subsections = [];
    let subscrition = this._kuralservice.getAllSubSections().subscribe({
      next : (res : Array<Categories>)=>{
        if(res != null){
          this.subsections = [...res];
        }
      },
      error : (error)=>{
        console.log(error);
      }

    })
    this.subscriptions.push(subscrition);
  }
  

  //#endregion

}
