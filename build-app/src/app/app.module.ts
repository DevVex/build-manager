import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule, Injectable} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [{provide: ErrorHandler,
    useClass: AppComponent}],
  bootstrap: [AppComponent]
})
export class AppModule { }
