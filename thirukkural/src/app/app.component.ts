import { Component } from '@angular/core';
import { LoadingserviceService } from './modules/shared/core/services/loadingservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  /**
   *
   */
  constructor(private loadingservice : LoadingserviceService) {
    this.loadingservice.componentMethodCalled$.subscribe(x=>{
      console.log(x);
    })
  }

}
