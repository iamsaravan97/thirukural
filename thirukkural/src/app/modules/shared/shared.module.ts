import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CategoryTreeFilterComponent } from './kuralfilter/category-tree-filter/category-tree-filter.component';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CategoryTreeFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    CategoryTreeFilterComponent
  ],

})
export class SharedModule { }
