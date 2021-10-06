import { Component } from '@angular/core';
import { KuralService } from './kural.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'thirukkural';
  results: any;

  /**
   *
   */
  constructor(private kuralService : KuralService) {
     this.results = this.kuralService.getkural();
     this.results.forEach(element => {
       element.KuralId = element.index;
       element.Id = element._id.$oid;
       delete element._id;
       delete element.index;
     });
     console.log(JSON.stringify(this.results));
  }
}
