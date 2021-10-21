import { Component, OnInit } from '@angular/core';
import { Kural } from 'src/app/model/kural';
import { KuralService } from 'src/app/service/kural.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _kuralservice: KuralService) { }

  ngOnInit(): void {
    this._kuralservice.getAllKurals().subscribe((res: Array<Kural>) => {
      console.log(res);
    })
  }



}
