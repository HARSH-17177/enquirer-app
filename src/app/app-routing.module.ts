import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnquirerAddComponent } from './Enquirer/enquirer-add.component';
import { EnquirerViewComponent } from './Enquirer/enquirer-view.component';
import { EnquirerUpdateComponent } from './Enquirer/enquirer-update.component';

const routes: Routes = [
  {path:'enquirer',component:EnquirerAddComponent},
  {path:'viewenquiry/:id',component:EnquirerViewComponent},
  {path:'updateenquiry/:id',component:EnquirerUpdateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
