import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingInterceptor } from '../interceptors/loading_interceptor';
import { LoadingserviceService } from './loadingservice.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
})
export class LoadingComponent implements OnInit {

  constructor(private loadingservice : LoadingInterceptor,private router : Router) {

    this.loadingservice.dataStream$().subscribe(x=>{
      alert(true);
    })


    this.loadingservice.dataStream$().subscribe(x=>{
      alert(true);
    })

   }

  ngOnInit(): void {
    this.loader();
  }
  loader() {
     this.loadingservice.dataStream$().subscribe(x=>{
       alert(x);
     })
  }



}
