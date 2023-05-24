import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from '@angular/material/table'
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatToolbarModule } from "@angular/material/toolbar";

import { AppComponent } from './app.component';
import { ReceiptsTableComponent } from './components/receipts-table/receipts-table.component';

import { ReceiptDialogComponent } from './components/receipt-dialog/receipt-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';

import { DrawAccountsService } from "./services/draw-accounts.service";
import { LocationsService } from "./services/locations.service";
import { ReceiptsService } from "./services/receipts.service";

@NgModule({
  declarations: [
    AppComponent,
    ReceiptsTableComponent,
    ReceiptDialogComponent,
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    MatSelectModule,
    MatSortModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  providers: [DrawAccountsService, LocationsService, ReceiptsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
