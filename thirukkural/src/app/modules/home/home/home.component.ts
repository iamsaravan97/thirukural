import { animate, state, style, transition, trigger } from '@angular/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { SharedService } from '../../shared/core/services/shared.service';

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
  trans_kuralno : string = "எண்"
  trans_kural : string = "குறள்கள்";
  trans_muva : string = "மு.வ உரை";
  trans_kalaignar : string = "கலைஞர் உரை";
  trans_pappaiyaa : string = "சாலமன் பாப்பையா உரை";
  trans_engcouplet : string = "ஆங்கில வழியில்";
  trans_engexp : string = "ஆங்கில உரை";
  trans_transliteration : string = "ஆங்கில உச்சரிப்பு";
  trans_colCategories :string  = "இயல்/பால்";


  //#endregion

  //#region grid setup
  displayedColumns : string[] = [this.trans_kuralno,this.trans_colCategories,this.trans_kural,this.trans_transliteration];
  displayedMobColumns : string[] = [this.trans_kuralno,this.trans_kural];
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;


  dataSource : MatTableDataSource<Kural>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pagesize : number = 10;
  pagesizeoptions : Array<number> = [5, 10, 20];
  paginationMode : PaginationMode = "Server"; //Server/Client

  currentPage : number = 0;
  panelOpenState : boolean = false;



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


  constructor(private _kuralservice: KuralService,private sharedService : SharedService, private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) { 
    this.loadfilter();
   this.loadKurals(this.filterList);
   this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
   this._mobileQueryListener = () => changeDetectorRef.detectChanges();
   // tslint:disable-next-line: deprecation
   this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.sharedService.onChangeFilterEmit.subscribe((result : FilterListDto)=>{
      this.onChangeFilter(result);
    })
    this.sharedService.resetFilerEmit.subscribe((result : FilterListDto)=>{
      if(result){
      this.loadfilter();
      this.loadKurals(this.filterList);
      }
    })
  }

  ngOnDestroy(){
    this.subscriptions.forEach(ele=>{
      ele.unsubscribe();
    })
  }


  loadKurals(filterList:FilterListDto){
    this.pagesizeoptions = [];
    if(this.paginationMode == "Client"){
      this.kuralgrid = [];
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

  loadfilter(){
    this.filterList = <FilterListDto>{
      Id : 0,
      ChapterIds : [],
      SectionIds :[],
      SubSectionIds :[],
      PageNumber : 1,
      PageSize : this.pagesize
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



  onChangeFilter(filter:FilterListDto){
    this.loadfilter(); //reset the filter
    this.filterList = filter;
    this.filterList.PageSize = this.pagesize;
    this.filterList.PageNumber = 1;
    this.loadKurals(filter);
  }

  sortData(event :any){
    this.kuralgrid = this.kuralgrid.sort((a,b)=>{
      let isAsc = event.direction == 'asc';
        return this.compare(a.Id,b.Id,isAsc)
    });
    this.dataSource = new MatTableDataSource<Kural>(this.kuralgrid);
  }


   compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
