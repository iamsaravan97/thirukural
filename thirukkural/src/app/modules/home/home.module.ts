import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeModule } from '@circlon/angular-tree-component';
import { CategoryTreeFilterComponent } from './category-tree-filter/category-tree-filter.component';




@NgModule({
  declarations: [
    HomeComponent,
    CategoryTreeFilterComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AngularMaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    TreeModule
  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
