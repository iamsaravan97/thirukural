import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const HomeModule = () => import('./modules/home/home.module').then(x => x.HomeModule);

const routes: Routes = [
 { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
