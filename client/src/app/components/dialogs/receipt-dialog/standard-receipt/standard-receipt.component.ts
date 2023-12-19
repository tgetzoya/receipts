import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {CurrencyPipe, formatDate} from "@angular/common";
import {map, Observable, startWith} from "rxjs";
import {DrawAccount} from "../../../../models/draw-account.model";
import {Receipt} from "../../../../models/receipt.model";
import {Location} from "../../../../models/location.model";
import {ScheduleService} from "../../../../services/schedule.service";
import {ReceiptsService} from "../../../../services/receipts.service";
import {ReceiptStatusType} from "../../../../enums/receipt-status-type";
import {Recurring} from "../../../../models/recurring.model.ts";

export function notExistsValidator(items: any[] | undefined): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value || !items || items.length == 0) {
      return null;
    }

    const exists = items.find(l => l.name?.toLowerCase() === value.toLowerCase());

    return exists ? null : {notExists: true};
  }
}

@Component({
  selector: 'app-standard-receipt',
  templateUrl: './standard-receipt.component.html',
  styleUrls: ['./standard-receipt.component.css']
})
export class StandardReceiptComponent implements OnInit, AfterViewInit, OnChanges {
  dateControl = new FormControl(new Date(), Validators.required);
  drawAccountControl = new FormControl('', Validators.required);
  donationControl = new FormControl('', Validators.required);
  intervalControl = new FormControl('');
  locationControl = new FormControl('', Validators.required);
  nextScheduledDateControl = new FormControl(new Date());
  salesTaxControl = new FormControl('', Validators.required);
  subtotalControl = new FormControl('', Validators.required);

  filteredDrawAccountOptions?: Observable<DrawAccount[]>;
  filteredLocationOptions?: Observable<Location[]>;

  duplicates: number = 0;
  intervals?: string[];
  receiptChanged = false;

  @Input()
  drawAccounts?: DrawAccount[];

  @Input()
  existingReceipt?: Receipt;

  @Input()
  isDuplicate: boolean = false;

  @Input()
  isRecurring: boolean = false;

  @Input()
  locations?: Location[];

  @Output()
  onReceiptCreated = new EventEmitter<any>();

  constructor(
    public currencyPipe: CurrencyPipe,
    public receiptsService: ReceiptsService,
    public scheduleService: ScheduleService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    if (this.existingReceipt) {
      if (!this.isDuplicate) {
        this.dateControl.setValue(this.existingReceipt?.date!);
      }
      this.drawAccountControl.setValue(this.existingReceipt.drawAccount?.name ? this.existingReceipt.drawAccount?.name : '');
      this.donationControl.setValue(this.currencyPipe.transform(this.existingReceipt.donation));
      this.locationControl.setValue(this.existingReceipt.location?.name ? this.existingReceipt.location.name : '');
      this.salesTaxControl.setValue(this.currencyPipe.transform(this.existingReceipt.salesTax));
      this.subtotalControl.setValue(this.currencyPipe.transform(this.existingReceipt.subtotal));
    }

    let formGroup = this.formBuilder.group({
      dateControl: this.dateControl,
      drawAccountControl: this.drawAccountControl,
      donationControl: this.donationControl,
      locationControl: this.locationControl,
      salesTaxControl: this.salesTaxControl,
      subtotalControl: this.subtotalControl
    });

    /* Any changes to the group will enable the save button. */
    formGroup.valueChanges.subscribe(value => {
      this.receiptChanged = true;
    });
  }

  ngAfterViewInit() {
    this.dateControl.valueChanges.subscribe((value) => {
      this.checkDuplicate();

      if (this.isRecurring) {
        this.setNextScheduledDate();
      }
    });

    this.locationControl.valueChanges.subscribe((value) => {
      this.checkDuplicate();
    });
  }

  ngOnChanges(): void {
    /* Because draw accounts and locations are dynamic, they get loaded after this view is created. So, to make sure
     * they populate, they have to go into OnChanges.
     */
    this.locationControl.addValidators(notExistsValidator(this.locations));
    this.drawAccountControl.addValidators(notExistsValidator(this.drawAccounts));

    this.filteredLocationOptions = this.locationControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterLocations(value || '')),
    );

    this.filteredDrawAccountOptions = this.drawAccountControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterDrawAccounts(value || '')),
    );

    if (this.isRecurring && (!this.intervals || this.intervals.length == 0)) {
      this.scheduleService.getScheduleIntervals().subscribe(res => {
        if (res) {
          this.intervals = res;

          if (this.isRecurring && this.intervals && this.intervals.length > 0) {
            this.intervalControl.setValue(this.intervals[0]);
          }
        }
      });
    }
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
    if (!control.value) {
      return;
    }

    let formatted = this.currencyPipe.transform(control.value.replace(/[^.\d]/g, ''));

    /* control.setValue will trigger a control change, even if the values are equal. This will cause the save button
     * to become enabled when it shouldn't be.
     */
    if (control.value !== formatted) {
      control.setValue(formatted);
    }
  }

  public checkDuplicate(): void {
    if (this.dateControl.invalid || this.locationControl.invalid) {
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
    ).subscribe((resp: Receipt[]) => {
      this.duplicates = 0;

      if (resp && resp.length > 0) {
        /* If there is an existing receipt, filter that out of the results. */
        if (this.existingReceipt) {
          resp = resp.filter((r): r is Receipt => r.compareTo(this.existingReceipt) != 0);
        }

        if (resp && resp.length > 0) {
          this.duplicates = resp.length;
        }
      }
    });
  }

  public setNextScheduledDate(): void {
    if (!(this.dateControl.value && this.intervalControl.value) || this.intervalControl.value == 'NONE') {
      this.nextScheduledDateControl.setValue(null);
    } else {
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

      this.nextScheduledDateControl.setValue(date);
    }
  }

  private markAllAsTouched(): void {
    this.drawAccountControl.markAsTouched();
    this.dateControl.markAsTouched();
    this.donationControl.markAsTouched();
    this.salesTaxControl.markAsTouched();
    this.subtotalControl.markAsTouched();
    this.locationControl.markAsTouched();
  }

  public save(): void {
    if (
      (this.drawAccountControl.invalid && !this.drawAccountControl.errors!['notExists']) ||
      this.dateControl.invalid ||
      this.donationControl.invalid ||
      (this.locationControl.invalid && !this.locationControl.errors!['notExists']) ||
      this.salesTaxControl.invalid ||
      this.subtotalControl.invalid
    ) {
      this.markAllAsTouched();
      return;
    }


    let receipt: Receipt = new Receipt();

    if (!this.isDuplicate && this.existingReceipt) {
      receipt.id = this.existingReceipt.id;
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

    receipt.date = new Date(this.dateControl.value ? this.dateControl.value : Date.now());
    receipt.location = location;
    receipt.donation = Number(this.donationControl.value!.replace(/[^.\d]/g, ''));
    receipt.salesTax = Number(this.salesTaxControl.value!.replace(/[^.\d]/g, ''));
    receipt.subtotal = Number(this.subtotalControl.value!.replace(/[^.\d]/g, ''));
    receipt.drawAccount = drawAccount;

    let recurring: Recurring | null = null;
    if (this.isRecurring) {
      recurring = new Recurring();
      recurring.interval = this.intervalControl.value!;
      recurring.nextDate = this.nextScheduledDateControl.value!;
    }

    this.onReceiptCreated.emit({
      receipt,
      type: receipt.id ? ReceiptStatusType.UPDATE : ReceiptStatusType.CREATE,
      recurring,
    });
  }
}
