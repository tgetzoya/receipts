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
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";

import { AppComponent } from './app.component';
import { ReceiptsTableComponent } from './components/views/receipts-view/receipts-table.component';
import { ReceiptDialogComponent } from './components/dialogs/receipt-dialog/receipt-dialog.component';

import { DeleteItemDialogComponent } from "./components/dialogs/delete-item-dialog/delete-item-dialog.component";
import { DeleteReceiptDialogComponent } from './components/dialogs/delete-receipt-dialog/delete-receipt-dialog.component';

import { DrawAccountsService } from "./services/draw-accounts.service";
import { LocationsService } from "./services/locations.service";
import { ReceiptsService } from "./services/receipts.service";

import { DrawAccountsTableComponent } from "./components/views/draw-accounts-view/draw-accounts-table.component";

import { LocationDialogComponent } from './components/dialogs/location-dialog/location-dialog.component';
import { LocationsTableComponent } from './components/views/locations-view/locations-table.component';
import { DrawAccountDialogComponent } from './components/dialogs/draw-account-dialog/draw-account-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DeleteItemDialogComponent,
    DeleteReceiptDialogComponent,
    DrawAccountDialogComponent,
    DrawAccountsTableComponent,
    LocationDialogComponent,
    LocationsTableComponent,
    ReceiptDialogComponent,
    ReceiptsTableComponent
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
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    ReactiveFormsModule
  ],
  providers: [DrawAccountsService, LocationsService, ReceiptsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
