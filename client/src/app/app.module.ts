import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CurrencyPipe} from '@angular/common';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatNativeDateModule} from "@angular/material/core";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSelectModule} from "@angular/material/select";
import {MatSortModule} from "@angular/material/sort";
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from "@angular/material/snack-bar";
import {MatTableModule} from '@angular/material/table'
import {MatTabsModule} from "@angular/material/tabs";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTooltipModule} from "@angular/material/tooltip";

import {AppComponent} from './app.component';
import {ReceiptsViewComponent} from './components/views/receipts-view/receipts-view.component';
import {ReceiptDialogComponent} from './components/dialogs/receipt-dialog/receipt-dialog.component';

import {DeleteItemDialogComponent} from "./components/dialogs/delete-item-dialog/delete-item-dialog.component";
import {DeleteReceiptDialogComponent} from './components/dialogs/delete-receipt-dialog/delete-receipt-dialog.component';

import {DrawAccountsService} from "./services/draw-accounts.service";
import {LocationsService} from "./services/locations.service";
import {ReceiptsService} from "./services/receipts.service";

import {DrawAccountsViewComponent} from "./components/views/draw-accounts-view/draw-accounts-view.component";

import {LocationDialogComponent} from './components/dialogs/location-dialog/location-dialog.component';
import {LocationsViewComponent} from './components/views/locations-view/locations-view.component';
import {DrawAccountDialogComponent} from './components/dialogs/draw-account-dialog/draw-account-dialog.component';
import {NotesViewComponent} from './components/views/notes-view/notes-view.component';
import {SchedulesViewComponent} from './components/views/schedules-view/schedules-view.component';
import {StandardReceiptComponent} from './components/dialogs/receipt-dialog/standard-receipt/standard-receipt.component';
import {GasReceiptComponent} from './components/dialogs/receipt-dialog/gas-receipt/gas-receipt.component';

@NgModule({
  declarations: [
    AppComponent,
    DeleteItemDialogComponent,
    DeleteReceiptDialogComponent,
    DrawAccountDialogComponent,
    DrawAccountsViewComponent,
    LocationDialogComponent,
    LocationsViewComponent,
    NotesViewComponent,
    ReceiptDialogComponent,
    ReceiptsViewComponent,
    SchedulesViewComponent,
    StandardReceiptComponent,
    GasReceiptComponent
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
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  providers: [
    CurrencyPipe,
    DrawAccountsService,
    LocationsService,
    ReceiptsService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 1500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
