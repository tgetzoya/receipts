import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';

import { DrawAccountsService } from "../../../services/draw-accounts.service";
import { LocationsService } from "../../../services/locations.service";

import { DrawAccount } from "../../../models/draw-account.model";
import { Location } from "../../../models/location.model";
import { Receipt } from "../../../models/receipt.model";

@Component({
  selector: 'app-receipt-dialog',
  templateUrl: './receipt-dialog.component.html',
  styleUrls: ['./receipt-dialog.component.css']
})
export class ReceiptDialogComponent implements OnInit {
  accountControl = new FormControl('', Validators.required);
  dateControl = new FormControl('', Validators.required);
  donationControl = new FormControl('', Validators.required);
  locationControl = new FormControl('', Validators.required);
  salesTaxControl = new FormControl('', Validators.required);
  subtotalControl = new FormControl('', Validators.required);

  filteredDrawAccountOptions!: Observable<DrawAccount[]>;
  filteredLocationOptions!: Observable<Location[]>;
  title!: string;

  drawAccounts?: DrawAccount[];
  locations?: Location[];

  constructor(
    public dialogRef: MatDialogRef<ReceiptDialogComponent>,
    public drawAccountsService: DrawAccountsService,
    public locationsService: LocationsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    if (this.data.receipt) {
      this.title = "Edit Receipt";

      this.accountControl.setValue(this.data.receipt.drawAccount.name);
      this.dateControl.setValue(this.data.duplicate ? '' : this.data.receipt.date);
      this.donationControl.setValue(this.data.receipt.donation);
      this.locationControl.setValue(this.data.receipt.location.name);
      this.salesTaxControl.setValue(this.data.receipt.salesTax);
      this.subtotalControl.setValue(this.data.receipt.subtotal);
    } else {
      this.title = "Create Receipt";
    }

    this.drawAccountsService.getDrawAccounts().subscribe(res => {
      this.drawAccounts = res.sort((a: DrawAccount,b: DrawAccount) => {return a.name!.localeCompare(b.name!)});

      this.filteredDrawAccountOptions = this.accountControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterDrawAccounts(value || '')),
      );
    });

    this.locationsService.getLocations().subscribe(res => {
      this.locations = res.sort((a: Location,b: Location) => {return a.name!.localeCompare(b.name!)});

      this.filteredLocationOptions = this.locationControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterLocations(value || '')),
      );
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

  private markAllAsTouched(): void {
    this.accountControl.markAsTouched();
    this.dateControl.markAsTouched();
    this.donationControl.markAsTouched();
    this.salesTaxControl.markAsTouched();
    this.subtotalControl.markAsTouched();
    this.locationControl.markAsTouched();
  }

  public save(): void {
    if (
      this.accountControl.invalid ||
      this.dateControl.invalid ||
      this.donationControl.invalid ||
      this.locationControl.invalid ||
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

    let date: string | null = this.dateControl.value;
    receipt.date = new Date(date ? date : Date.now());
    receipt.location = this.locations!.find(l => l.name === this.locationControl.value);
    receipt.donation = this.donationControl.value!;
    receipt.salesTax = this.salesTaxControl.value!;
    receipt.subtotal = this.subtotalControl.value!;
    receipt.drawAccount = this.drawAccounts!.find(a => a.name === this.accountControl.value);


    this.dialogRef.close(receipt);
  }
}
