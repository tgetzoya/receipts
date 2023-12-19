import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CurrencyPipe} from "@angular/common";

import {DrawAccountsService} from "../../../services/draw-accounts.service";
import {LocationsService} from "../../../services/locations.service";
import {ReceiptsService} from "../../../services/receipts.service";
import {ScheduleService} from "../../../services/schedule.service";
import {Receipt} from "../../../models/receipt.model";
import {DrawAccount} from "../../../models/draw-account.model";
import {Location} from "../../../models/location.model";
import {DrawAccountSortOrder} from "../../../enums/draw-account-sort-order";
import {ReceiptStatusType} from "../../../enums/receipt-status-type";
import {ReceiptType} from "../../../enums/receipt-type";
import {Recurring} from "../../../models/recurring.model.ts";
import {Schedule} from "../../../models/schedule.model";
import {Gas} from "../../../models/gas.model";
import {NotesService} from "../../../services/notes.service";
import {Note} from "../../../models/note.model";

@Component({
  selector: 'app-receipt-dialog',
  templateUrl: './receipt-dialog.component.html',
  styleUrls: ['./receipt-dialog.component.css']
})
export class ReceiptDialogComponent implements OnInit, AfterViewInit {
  title!: string;
  receiptTypes: string[] = Object.values(ReceiptType);

  receiptTypeControl = new FormControl();

  existingReceipt?: Receipt;

  drawAccounts?: DrawAccount[];
  locations?: Location[];

  receiptData?: Receipt;
  recurringData?: Recurring;
  gasData?: Gas;

  constructor(
    public currencyPipe: CurrencyPipe,
    public dialogRef: MatDialogRef<ReceiptDialogComponent>,
    public drawAccountService: DrawAccountsService,
    public locationService: LocationsService,
    public receiptsService: ReceiptsService,
    public scheduleService: ScheduleService,
    public notesService: NotesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    this.existingReceipt = this.data.receipt;

    this.title = (this.existingReceipt ? 'Update' : 'Create') + ' Receipt';
    this.receiptTypeControl.setValue(this.receiptTypes[0]);
  }

  ngAfterViewInit(): void {
    this.drawAccountService.getDrawAccounts(DrawAccountSortOrder.MOST_USED).subscribe(res => {
      this.drawAccounts = res;
    });

    this.locationService.getLocations().subscribe(res => {
      this.locations = res.sort((a: Location, b: Location) => {
        return a.name!.localeCompare(b.name!)
      });
    });
  }

  handleReceiptEmitted(resp: any): void {
    if (!resp) {
      this.dialogRef.close(null);
    }

    this.receiptData = resp.receipt;
    this.recurringData = resp.recurring;
    this.gasData = resp.gas;

    if (this.receiptData) {
      if (!this.receiptData.location?.id) {
        this.createNewLocation();
      } else if (!this.receiptData.drawAccount?.id) {
        this.createNewDrawAccount();
      } else {
        /* If this is an edit, make sure something actually changed. Otherwise, no need to stress the database. */
        if (resp.type == ReceiptStatusType.CREATE || (resp.type == ReceiptStatusType.UPDATE && this.receiptData.compareTo(this.existingReceipt) > 0)) {
          this.createOrUpdateReceipt();
        } else {
          /* The window is closed without changes. */
          this.dialogRef.close(null);
        }
      }
    }

    /* Do _not_ put a this.dialogRef.close here, it _will_ trigger even if the createOrUpdateReceipt() does as well. */
  }

  private createNewLocation(): void {
    this.locationService.createOrUpdateLocation(this.receiptData!.location!).subscribe(resp => {
      if (resp) {
        this.receiptData!.location = resp;

        if (!this.receiptData!.drawAccount?.id) {
          this.createNewDrawAccount();
        } else {
          this.createOrUpdateReceipt();
        }
      }
    });
  }

  private createNewDrawAccount(): void {
    this.drawAccountService.createOrUpdateDrawAccount(this.receiptData!.drawAccount!).subscribe(resp => {
      if (resp) {
        this.receiptData!.drawAccount = resp;
        this.createOrUpdateReceipt();
      }
    });
  }

  private createOrUpdateReceipt(): void {
    this.receiptsService.createOrUpdateReceipt(this.receiptData!).subscribe(resp => {
      if (this.recurringData) {
        this.createRecurring();
      } else if (this.gasData) {
        this.createGasNotes(resp);
      } else {
        this.dialogRef.close(resp);
      }
    });
  }

  private createRecurring(): void {
    let schedule: Schedule = Schedule.fromReceipt(this.receiptData!);
    schedule.interval = this.recurringData?.interval;
    schedule.nextDate = this.recurringData?.nextDate;

    this.scheduleService.createSchedule(schedule).subscribe(resp => {
      this.dialogRef.close(this.receiptData);
    });
  }

  private createGasNotes(receipt: Receipt): void {
    /* 10.716G @ $3.499/G = $36.50 */
    let note1 = new Note();
    note1.receiptId = receipt.id;
    note1.note = this.gasData?.gallons
      + "G @ $"
      + this.gasData?.pricePerGallon
      + "/G = $" + (this.gasData?.gallons! * this.gasData?.pricePerGallon!).toFixed(2);

    /* ¢18.4 Federal tax = 10.716 * 0.184 = 1.9717 = $1.97 */
    let note2 = new Note();
    note2.receiptId = receipt.id;
    note2.note = '¢' + (this.gasData?.federalTax! * 100).toFixed(1)
      + ' Federal tax = '
      + this.gasData?.gallons!
      + ' * '
      + this.gasData?.federalTax
      + ' = '
      + (this.gasData?.gallons! * this.gasData?.federalTax!).toFixed(3)
      + ' = $'
      + (this.gasData?.gallons! * this.gasData?.federalTax!).toFixed(2);

    /* ¢20 State tax = 10.716 * .20 = 1.972 = $2.14 */
    let note3 = new Note();
    note3.receiptId = receipt.id;
    note3.note = '¢' + (this.gasData?.stateTax! * 100).toFixed(1)
      + ' State tax = '
      + this.gasData?.gallons!
      + ' * '
      + this.gasData?.stateTax
      + ' = '
      + (this.gasData?.gallons! * this.gasData?.stateTax!).toFixed(3)
      + ' = $'
      + (this.gasData?.gallons! * this.gasData?.stateTax!).toFixed(2);

    this.notesService.createNote(note1).subscribe(resp => {});
    this.notesService.createNote(note2).subscribe(resp => {});
    this.notesService.createNote(note3).subscribe(resp => {});

    this.dialogRef.close(receipt);
  }
}
