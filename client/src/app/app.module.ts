import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from "@angular/material/sort";

import { AppComponent } from './app.component';
import { ReceiptsTableComponent } from './receipts-table/receipts-table.component';

import { ReceiptsService } from "./services/receipts.service";

@NgModule({
  declarations: [
    AppComponent,
    ReceiptsTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule
  ],
  providers: [ReceiptsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
