import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {AbstractControl, FormBuilder, FormControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";

import {DrawAccount} from "../../../../models/draw-account.model";
import {Gas} from "../../../../models/gas.model";
import {Location} from "../../../../models/location.model";
import {Receipt} from "../../../../models/receipt.model";
import {ReceiptsService} from "../../../../services/receipts.service";
import {ScheduleService} from "../../../../services/schedule.service";

import {ReceiptStatusType} from "../../../../enums/receipt-status-type";

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
  selector: 'app-gas-receipt',
  templateUrl: './gas-receipt.component.html',
  styleUrls: ['./gas-receipt.component.css']
})
export class GasReceiptComponent implements OnInit, AfterViewInit {
  dateControl = new FormControl(new Date(), Validators.required);
  drawAccountControl = new FormControl('', Validators.required);
  federalTaxAmountControl = new FormControl({value: '', disabled: true}, Validators.required);
  federalTaxControl = new FormControl('', Validators.required);
  gallonsControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  pricePerGallonControl = new FormControl('', Validators.required);
  stateTaxAmountControl = new FormControl({value: '', disabled: true}, Validators.required);
  stateTaxControl = new FormControl('', Validators.required);

  filteredDrawAccountOptions?: Observable<DrawAccount[]>;
  filteredLocationOptions?: Observable<Location[]>;

  duplicates: number = 0;
  receiptChanged = false;

  @Input()
  drawAccounts?: DrawAccount[];

  @Input()
  existingReceipt?: Receipt;

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
    let formGroup = this.formBuilder.group({
      dateControl: this.dateControl,
      drawAccountControl: this.drawAccountControl,
      locationControl: this.locationControl,
      salesTaxControl: this.stateTaxControl,
      subtotalControl: this.federalTaxControl
    });

    /* Any changes to the group will enable the save button. */
    formGroup.valueChanges.subscribe(value => {
      this.receiptChanged = true;
      this.calculateTaxes();
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
  }

  ngAfterViewInit() {
    this.dateControl.valueChanges.subscribe((value) => {
      this.checkDuplicate();
    });

    this.locationControl.valueChanges.subscribe((value) => {
      this.checkDuplicate();
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

  calculateTaxes(): void {
    let gallons = Number(this.gallonsControl.value);

    if (isNaN(gallons) || gallons <= 0) {
      return;
    }

    let pricePerGallon = Number(this.pricePerGallonControl.value!.replace(/[^.\d]/g, ''));

    if (isNaN(pricePerGallon) || pricePerGallon <= 0) {
      return;
    }

    let federalTax = Number(this.federalTaxControl.value!.replace(/[^.\d]/g, ''));

    if (isNaN(federalTax) || federalTax <= 0) {
      return;
    }

    let stateTax = Number(this.stateTaxControl.value!.replace(/[^.\d]/g, ''));

    if (isNaN(stateTax) || stateTax <= 0) {
      return;
    }

    let federalTaxAmount = (gallons * federalTax).toFixed(2);
    let stateTaxAmount = (gallons * stateTax).toFixed(2);

    this.federalTaxAmountControl.setValue(this.currencyPipe.transform(federalTaxAmount.replace(/[^.\d]/g, '')));
    this.stateTaxAmountControl.setValue(this.currencyPipe.transform(stateTaxAmount.replace(/[^.\d]/g, '')));
  }

  private markAllAsTouched(): void {
    this.drawAccountControl.markAsTouched();
    this.dateControl.markAsTouched();
    this.federalTaxControl.markAsTouched();
    this.stateTaxControl.markAsTouched();
    this.locationControl.markAsTouched();
  }

  public save(): void {
    if (
      (this.drawAccountControl.invalid && !this.drawAccountControl.errors!['notExists']) ||
      this.dateControl.invalid ||
      (this.locationControl.invalid && !this.locationControl.errors!['notExists']) ||
      this.federalTaxControl.invalid ||
      this.stateTaxControl.invalid
    ) {
      this.markAllAsTouched();
      return;
    }

    let receipt: Receipt = new Receipt();

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

    let gas = new Gas();
    gas.gallons = Number(this.gallonsControl.value);
    gas.pricePerGallon = Number(this.pricePerGallonControl.value!.replace(/[^.\d]/g, ''));
    gas.federalTax = Number(this.federalTaxControl.value!.replace(/[^.\d]/g, ''));
    gas.stateTax = Number(this.stateTaxControl.value!.replace(/[^.\d]/g, ''));


    receipt.date = new Date(this.dateControl.value ? this.dateControl.value : Date.now());
    receipt.location = location;
    receipt.donation = Number(0);
    receipt.salesTax = Number((gas.gallons * (gas.federalTax + gas.stateTax)).toFixed(2));
    receipt.subtotal = Number((gas.gallons * gas.pricePerGallon).toFixed(2));
    receipt.drawAccount = drawAccount;

    this.onReceiptCreated.emit({
      receipt,
      type: ReceiptStatusType.CREATE,
      gas,
    });
  }
}
