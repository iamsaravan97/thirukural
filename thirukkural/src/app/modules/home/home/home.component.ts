import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Categories } from 'src/app/model/categories';
import { FilterListDto } from 'src/app/model/filterlis';
import { Kural } from 'src/app/model/kural';
import { KuralService } from 'src/app/service/kural.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,AfterViewInit {

  //#region  subscription
  subscriptions : Subscription[] =[];
  //#endregion

  //#region kural properties
  categories : Array<Categories>=[];
  sections : Array<Categories>=[];
  subsections : Array<Categories>=[];
  kuralgrid : Array<Kural> = [];
  //#endregion

  //#region multi language properties

  trans_categories : string = "அதிகாரங்கள்"
  trans_sections : string = "பால்கள்"
  trans_subsections : string = "இயல்கள்"
  trans_kuralno : string = "குறள் எண்"
  trans_kural : string = "குறள்கள்"

  //#endregion

  //#region grid setup
  displayedColumns : string[] = ['Id','Kural']

  dataSource : MatTableDataSource<Kural>

  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  ngAfterViewInit() {
   // this.dataSource.paginator = this.paginator;
    console.log( this.paginator.page);
  }

  //#endregion

  //#region filterquery
  filterList :FilterListDto = {
    Id : 0,
    ChapterIds : [],
    SectionIds :[],
    SubSectionIds :[]
  }

  //#endregion


  constructor(private _kuralservice: KuralService) { 
    var filterList = <FilterListDto>{
      Id : 0,
      ChapterIds : [],
      SectionIds :[],
      SubSectionIds :[]
    }
    this.loadKurals(filterList);
    this.loadAllChapters();
    this.loadAllSections();
    this.loadAllSubSections();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.subscriptions.forEach(ele=>{
      ele.unsubscribe();
    })
  }

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
        console.log(res);
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
        console.log(res);
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

  loadKurals(filterList:FilterListDto){
    let subscription = this._kuralservice.getKuralsByList(filterList).subscribe({
      next : (res : Array<Kural>)=>{
        if(res != null)
        this.kuralgrid = [...res];
        this.dataSource = new MatTableDataSource<Kural>(this.kuralgrid);
      }
    })
    this.subscriptions.push(subscription);
  }

  resetfilter(){
    this.filterList = {
      Id : 0,
      ChapterIds : [],
      SectionIds :[],
      SubSectionIds :[]
    }
  }


  save(){
    alert("hi");
  }

  filterbyChapterId(e,selectedcategories:Array<any>){
    this.filterList.ChapterIds = [];
    if(selectedcategories.length != 0 ){
      selectedcategories.forEach(ele=>{
        this.filterList.ChapterIds.push(ele.value.Id);
      })
    }
    this.loadKurals(this.filterList);
  }


  filterbySectionId(e,selectedsection:Array<any>){
    this.filterList.SectionIds = [];
    if(selectedsection.length != 0 ){
      selectedsection.forEach(ele=>{
        this.filterList.SectionIds.push(ele.value.Id);
      })
    }
    this.loadKurals(this.filterList);
  }

  filterbySubsectionId(e,selectedsubsection:Array<any>){
    this.filterList.SubSectionIds = [];
    if(selectedsubsection.length != 0 ){
      selectedsubsection.forEach(ele=>{
        this.filterList.SubSectionIds.push(ele.value.Id);
      })
    }
    this.loadKurals(this.filterList);
  }




}
