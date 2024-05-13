import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnquirerAddComponent } from './Enquirer/enquirer-add.component';
import { HttpClientModule } from '@angular/common/http';
import { EnquirerViewComponent } from './Enquirer/enquirer-view.component';
import { EnquirerUpdateComponent } from './Enquirer/enquirer-update.component';

@NgModule({
  declarations: [
    AppComponent,
  EnquirerAddComponent,
  EnquirerViewComponent,
  EnquirerUpdateComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
