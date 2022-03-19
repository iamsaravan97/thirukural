import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingserviceService } from '../../core/services/loadingservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  showloader : boolean = false;
  counter: number = 0;
  private _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  color  = 'Accent'
  checked = false;
  disabled = false;
  filtertogglelabel : string = "Standard";
  filtertogglePosition : string = "before"

  constructor(private loadingservice : LoadingserviceService,
    private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {
    this.loadingservice.showLoaderEvent.subscribe(x=>{

      this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      // tslint:disable-next-line: deprecation
      this.mobileQuery.addListener(this._mobileQueryListener);

        if(x==true){
          this.showloader = x;
           this.counter = this.counter = this.counter+1;
        }
        else this.counter = this.counter = this.counter-1;
        if(this.counter == 0)
         this.showloader = false;
         
    })
  }

  ngOnInit(): void {
  }

  


  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
}


  ngOnDestroy(): void {
      // tslint:disable-next-line: deprecation
      this.mobileQuery.removeListener(this._mobileQueryListener);
     // this.autoLogoutSubscription.unsubscribe();
  }


  onChangeFilter(e:any){
    console.log(e);
  }

  categoryFilterChange(e){
    if(e?.checked){
      this.filtertogglePosition = "after"
      this.filtertogglelabel = "Custom";
      this.checked = true;
    }else{
      this.checked = false;
      this.filtertogglePosition = "before"
      this.filtertogglelabel = "Standard";
    }
   
  }

}
