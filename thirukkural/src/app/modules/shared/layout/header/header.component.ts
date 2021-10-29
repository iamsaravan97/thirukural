import { Component, OnInit } from '@angular/core';
import { LoadingserviceService } from '../../core/services/loadingservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  showloader : boolean = false;
  counter: number = 0;

  constructor(private loadingservice : LoadingserviceService) {
    this.loadingservice.showLoaderEvent.subscribe(x=>{

        
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

}
