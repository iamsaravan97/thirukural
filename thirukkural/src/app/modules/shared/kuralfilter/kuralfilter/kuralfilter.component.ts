import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { Categories } from 'src/app/model/categories';
import { FilterListDto } from 'src/app/model/filterlis';
import { KuralService } from 'src/app/service/kural.service';
import { SharedService } from '../../core/services/shared.service';

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
  filterList :FilterListDto = {
    Id : 0,
    ChapterIds : [],
    SectionIds :[],
    SubSectionIds :[],
    PageNumber : 0,
    PageSize : 0
  }
  c : ThemePalette
  //#endregion


    //#region  subscription
    subscriptions : Subscription[] =[];
    //#endregion

    //#region kural properties
    categories : Array<Categories>=[];
    sections : Array<Categories>=[];
    subsections : Array<Categories>=[];
    //#endregion

  constructor(private _kuralservice: KuralService, private sharedService : SharedService) {
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

  //#region  filter clicks

  filterbyChapterId(e,selectedcategories:Array<any>){
    this.filterList.ChapterIds = [];
    this.filterList.SubSectionIds = [];
    this.filterList.SectionIds = [];
    //this.resetfilter();
    if(selectedcategories.length != 0 ){
      selectedcategories.forEach(ele=>{
        this.filterList.ChapterIds.push(ele.value.Id);
      })
    }
     this.sharedService.onChangeFilter(this.filterList);
  }


  filterbySectionId(e,selectedsection:Array<any>){
    this.filterList.ChapterIds = [];
    this.filterList.SubSectionIds = [];
    this.filterList.SectionIds = [];
  //  this.resetfilter();
    if(selectedsection.length != 0 ){
      selectedsection.forEach(ele=>{
        this.filterList.SectionIds.push(ele.value.Id);
      })
    }
    this.sharedService.onChangeFilter(this.filterList);
  }

  filterbySubsectionId(e,selectedsubsection:Array<any>){
    this.filterList.ChapterIds = [];
    this.filterList.SubSectionIds = [];
    this.filterList.SectionIds = [];
    //this.resetfilter();
    if(selectedsubsection.length != 0 ){
      selectedsubsection.forEach(ele=>{
        this.filterList.SubSectionIds.push(ele.value.Id);
      })
    }
    this.sharedService.onChangeFilter(this.filterList);
  }

  //#endregion

}
