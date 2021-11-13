import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Categories } from 'src/app/model/categories';
import { FilterDto } from 'src/app/model/filterdto';
import { FilterListDto } from 'src/app/model/filterlis';
import { Kural } from 'src/app/model/kural';
import { PagedList } from 'src/app/model/pagedresults';
import { PaginationMode } from 'src/app/model/type/type';
import { KuralService } from 'src/app/service/kural.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {

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
  trans_kural : string = "குறள்கள்";
  trans_muva : string = "மு.வ உரை";
  trans_kalaignar : string = "கலைஞர் உரை";
  trans_pappaiyaa : string = "சாலமன் பாப்பையா உரை";
  trans_engcouplet : string = "ஆங்கில வழியில்";
  trans_engexp : string = "ஆங்கில உரை";
  trans_transliteration : string = "ஆங்கில உச்சரிப்பு";

  //#endregion

  //#region grid setup
  displayedColumns : string[] = [this.trans_kuralno,this.trans_kural,this.trans_transliteration]

  dataSource : MatTableDataSource<Kural>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pagesize : number = 10;
  pagesizeoptions : Array<number> = [5, 10, 20];
  paginationMode : PaginationMode = "Server"; //Server/Client

  currentPage : number = 0;



  //#endregion

  //#region filterquery
  filterList :FilterListDto = {
    Id : 0,
    ChapterIds : [],
    SectionIds :[],
    SubSectionIds :[],
    PageNumber : 0,
    PageSize : 0
  }
  totalRows: number;

  //#endregion


  constructor(private _kuralservice: KuralService) { 
    var filterList = <FilterListDto>{
      Id : 0,
      ChapterIds : [],
      SectionIds :[],
      SubSectionIds :[],
      PageNumber : 1,
      PageSize : this.pagesize
    }
    //this.loadKurals(filterList);
   // this.loadAllChapters();
   // this.loadAllSections();
    //this.loadAllSubSections();
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
    this.pagesizeoptions = [];
    if(this.paginationMode == "Client"){
    let subscription = this._kuralservice.getKuralsByList(filterList).subscribe({
      next : (res : Array<Kural>)=>{
        if(res != null)
        this.kuralgrid = [...res];
        this.dataSource = new MatTableDataSource<Kural>(this.kuralgrid);
        this.dataSource.paginator = this.paginator;
        this.pagesizeoptions =[5,10];
        this.totalRows = res.length
        if(res.length > 10)
        this.pagesizeoptions.push(res.length)
      }
    })
    this.subscriptions.push(subscription);
  }else{
    let subscription = this._kuralservice.getKuralsPagedResultsByList(filterList).subscribe({
      next : (res : PagedList<Kural>)=>{
        if(res != null)
        this.kuralgrid = [...res.Items];
        this.dataSource = new MatTableDataSource<Kural>(this.kuralgrid);
       // this.dataSource._updateChangeSubscription();
        this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.dataSource.paginator.pageIndex = this.currentPage;
          this.dataSource.paginator.length = res.TotalCount;
        });
        this.pagesizeoptions =[5,10];
        this.totalRows = res.TotalCount
        if(res.Items.length > 10)
        this.pagesizeoptions.push(res.TotalPages)
      }
    })
    this.subscriptions.push(subscription);
  }
  }

  resetfilter(){
    this.filterList = {
      Id : 0,
      ChapterIds : [],
      SectionIds :[],
      SubSectionIds :[],
      PageSize : this.pagesize,
      PageNumber : 1
    }
  }

  pageChanged(e:any){
    if(this.paginationMode!='Client'){
    var filter = this.filterList;
    filter.PageNumber = e.pageIndex+1;
    this.currentPage = e.pageIndex;
    filter.PageSize = e.pageSize;
    this.loadKurals(filter);
    }
  }

  filterbyChapterId(e,selectedcategories:Array<any>){
    this.filterList.ChapterIds = [];
    //this.resetfilter();
    if(selectedcategories.length != 0 ){
      selectedcategories.forEach(ele=>{
        this.filterList.ChapterIds.push(ele.value.Id);
      })
    }
    this.loadKurals(this.filterList);
  }


  filterbySectionId(e,selectedsection:Array<any>){
    this.filterList.SectionIds = [];
  //  this.resetfilter();
    if(selectedsection.length != 0 ){
      selectedsection.forEach(ele=>{
        this.filterList.SectionIds.push(ele.value.Id);
      })
    }
    this.loadKurals(this.filterList);
  }

  filterbySubsectionId(e,selectedsubsection:Array<any>){
    this.filterList.SubSectionIds = [];
    //this.resetfilter();
    if(selectedsubsection.length != 0 ){
      selectedsubsection.forEach(ele=>{
        this.filterList.SubSectionIds.push(ele.value.Id);
      })
    }
    this.loadKurals(this.filterList);
  }

  onChangeFilter(e:FilterDto){
    console.log(e);
  }




}
