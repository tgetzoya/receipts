import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { CurrencyPipe, formatDate } from "@angular/common";

import { DrawAccountsService } from "../../../services/draw-accounts.service";
import { LocationsService } from "../../../services/locations.service";
import { ReceiptsService } from "../../../services/receipts.service";
import { ScheduleService } from "../../../services/schedule.service";

import { DrawAccount } from "../../../models/draw-account.model";
import { Location } from "../../../models/location.model";
import { Receipt } from "../../../models/receipt.model";
import { Schedule } from "../../../models/schedule.model";

export function notExistsValidator(items: any[]): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
    const value = control.value;

    if (!value || !items || items.length == 0) {
      return null;
    }

    const exists = items.find(l => l.name?.toLowerCase() === value.toLowerCase());

    return exists ? null : {notExists: true};
  }
}

@Component({
  selector: 'app-receipt-dialog',
  templateUrl: './receipt-dialog.component.html',
  styleUrls: ['./receipt-dialog.component.css']
})
export class ReceiptDialogComponent implements OnInit {
  drawAccountControl = new FormControl('', Validators.required);
  dateControl = new FormControl('', Validators.required);
  donationControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  salesTaxControl = new FormControl('', Validators.required);
  subtotalControl = new FormControl('', Validators.required);
  intervalControl = new FormControl('');
  nextScheduledDateControl = new FormControl('');

  filteredDrawAccountOptions!: Observable<DrawAccount[]>;
  filteredLocationOptions!: Observable<Location[]>;
  title!: string;

  drawAccounts?: DrawAccount[];
  locations?: Location[];
  intervals?: string[];
  schedule?: Schedule;

  existingReceipts: Receipt[] = [];

  constructor(
    public currencyPipe: CurrencyPipe,
    public dialogRef: MatDialogRef<ReceiptDialogComponent>,
    public drawAccountsService: DrawAccountsService,
    public locationsService: LocationsService,
    public receiptsService: ReceiptsService,
    public scheduleService: ScheduleService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    if (this.data.receipt || this.data.schedule) {
      let drawAccount = this.data.receipt ? this.data.receipt.drawAccount.name : this.data.schedule.drawAccount.name;
      let donation = this.data.receipt ? this.data.receipt.donation : this.data.schedule.donation;
      let location = this.data.receipt ? this.data.receipt.location.name : this.data.schedule.location.name;
      let salesTax = this.data.receipt ? this.data.receipt.salesTax : this.data.schedule.salesTax;
      let subtotal = this.data.receipt ? this.data.receipt.subtotal : this.data.schedule.subtotal;


      this.title = this.data.receipt ? "Edit Receipt" : "Edit Scheduled";

      /* Only for receipt, not used in schedule. */
      if (this.data.receipt) {
        this.dateControl.setValue(this.data.duplicate ? '' : this.data.receipt.date);
      }

      this.drawAccountControl.setValue(drawAccount);
      this.donationControl.setValue(this.currencyPipe.transform(donation));
      this.locationControl.setValue(location);
      this.salesTaxControl.setValue(this.currencyPipe.transform(salesTax));
      this.subtotalControl.setValue(this.currencyPipe.transform(subtotal));
    } else {
      this.title = "Create Receipt";
    }

    this.drawAccountsService.getDrawAccounts().subscribe(res => {
      this.drawAccounts = res.sort((a: DrawAccount,b: DrawAccount) => {return a.name!.localeCompare(b.name!)});

      this.drawAccountControl.addValidators(notExistsValidator(this.drawAccounts));

      this.filteredDrawAccountOptions = this.drawAccountControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterDrawAccounts(value || '')),
      );
    });

    this.locationsService.getLocations().subscribe(res => {
      this.locations = res.sort((a: Location,b: Location) => {return a.name!.localeCompare(b.name!)});

      this.locationControl.addValidators(notExistsValidator(this.locations));

      this.filteredLocationOptions = this.locationControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterLocations(value || '')),
      );
    });

    this.scheduleService.getScheduleIntervals().subscribe(res => {
      if (res) {
        this.intervals = res;

        if (this.data.receipt && this.data.receipt.id && this.data.receipt.id > 0) {
          this.scheduleService.getScheduleByLocationId(this.data.receipt.location.id).subscribe(resp => {
            if (resp && resp.interval && resp.nextDate) {
              this.schedule = resp;
              this.intervalControl.setValue(resp.interval);
              this.nextScheduledDateControl.setValue(formatDate(resp.nextDate, 'yyyy-MM-dd', 'en'));
            } else {
              this.schedule = new Schedule();
            }
          });
        } else if (this.data.schedule) {
          this.intervalControl.setValue(this.data.schedule.interval);
          this.nextScheduledDateControl.setValue(formatDate(this.data.schedule.nextDate, 'yyyy-MM-dd', 'en'));
        }
      }
    });
  }

  private filterDrawAccounts(value: string): Location[] {
    if (this.drawAccounts && this.drawAccounts.length > 0) {
      const filterValue = value.toLowerCase();
      return this.drawAccounts.filter(account => account.name!.toLowerCase().includes(filterValue));
    } else {
      return [];
    }
  }

  private filterLocations(value: string): Location[] {
    if (this.locations && this.locations.length > 0) {
      const filterValue = value.toLowerCase();
      return this.locations.filter(location => location.name!.toLowerCase().includes(filterValue));
    } else {
      return [];
    }
  }

  public formatInputForCurrency(control: FormControl): void {
    control.setValue(this.currencyPipe.transform(control.value.replace(/[^.\d]/g, '')));
  }

  private markAllAsTouched(): void {
    this.drawAccountControl.markAsTouched();
    this.dateControl.markAsTouched();
    this.donationControl.markAsTouched();
    this.salesTaxControl.markAsTouched();
    this.subtotalControl.markAsTouched();
    this.locationControl.markAsTouched();
  }

  public checkDuplicate(): void {
    if (this.dateControl.invalid  || this.locationControl.invalid) {
      return;
    }

    let date: Date = new Date(this.dateControl.value!);
    let location = this.locations!.find(l => l.name === this.locationControl.value!);

    if (!location) {
      return;
    }

    this.receiptsService.getReceiptsByDateAndLocation(
      date.toISOString().slice(0, 10),
      location?.id
    ).subscribe(resp => {
      if (resp && resp.length > 0) {
        this.existingReceipts = resp;
      } else {
        this.existingReceipts = [];
      }
    });
  }

  public setNextScheduledDate(): void {
    if (!(this.dateControl.value && this.intervalControl.value) || this.intervalControl.value == 'NONE') {
      this.nextScheduledDateControl.setValue(null);
      return
    }

    let date: Date = new Date(new Date(this.dateControl.value).toDateString());
    let now: Date = new Date(new Date(Date.now()).toDateString());

    switch (this.intervalControl.value) {
      case 'DAILY': {
        while (date <= now) {
          date.setDate(date.getDate() + 1);
        }
        break;
      }
      case 'WEEKLY': {
        while (date <= now) {
          date.setDate(date.getDate() + 7);
        }
        break;
      }
      case 'MONTHLY': {
        while (date <= now) {
          date.setMonth(date.getMonth() + 1);
        }
        break;
      }
      case 'ANNUALLY': {
        while (date <= now) {
          date.setFullYear(date.getFullYear() + 1);
        }
        break;
      }
      default: {
        break;
      }
    }

    this.nextScheduledDateControl.setValue(formatDate(date, 'yyyy-MM-dd', 'en'));
  }

  private createSchedule(drawAccount: DrawAccount, location: Location): Schedule | undefined {
    if (!this.intervalControl.value || !this.nextScheduledDateControl.value) {
      return undefined;
    }

    let schedule: Schedule = new Schedule();

    if (this.data.schedule?.id) {
      schedule.id = this.data.schedule.id;
    }
    schedule.drawAccount = drawAccount;
    schedule.interval = String(this.intervalControl.value);
    schedule.donation = Number(this.donationControl.value!.replace(/[^.\d]/g, ''));
    schedule.location = location;
    schedule.salesTax = Number(this.salesTaxControl.value!.replace(/[^.\d]/g, ''));
    schedule.subtotal = Number(this.subtotalControl.value!.replace(/[^.\d]/g, ''));
    schedule.nextDate = new Date(this.nextScheduledDateControl.value);

    return schedule;
  }

  public save(): void {
    if (
      (this.drawAccountControl.invalid && !this.drawAccountControl.errors!['notExists']) ||
      (!this.data.schedule && this.dateControl.invalid) ||
      this.donationControl.invalid ||
      (this.locationControl.invalid && !this.locationControl.errors!['notExists']) ||
      this.salesTaxControl.invalid ||
      this.subtotalControl.invalid
    ) {
      this.markAllAsTouched();
      return;
    }

    let receipt: Receipt = new Receipt();

    if (!this.data.duplicate && this.data.receipt) {
      receipt.id = this.data.receipt.id;
    }

    let location = this.locations!.find(l => l.name === this.locationControl.value);

    if (!location) {
      location = new Location();
      location.name = this.locationControl.value!;
    }

    let drawAccount = this.drawAccounts!.find(a => a.name === this.drawAccountControl.value);

    if (!drawAccount) {
      drawAccount = new DrawAccount();
      drawAccount.name = this.drawAccountControl.value!;
    }

    if (!this.data.schedule) {
      let date: string | null = this.dateControl.value;
      receipt.date = new Date(date ? date : Date.now());
      receipt.location = location;
      receipt.donation = Number(this.donationControl.value!.replace(/[^.\d]/g, ''));
      receipt.salesTax = Number(this.salesTaxControl.value!.replace(/[^.\d]/g, ''));
      receipt.subtotal = Number(this.subtotalControl.value!.replace(/[^.\d]/g, ''));
      receipt.drawAccount = drawAccount;

      this.dialogRef.close({receipt, schedule: this.createSchedule(drawAccount, location)});
    } else {
      this.dialogRef.close(this.createSchedule(drawAccount, location));
    }
  }
}
