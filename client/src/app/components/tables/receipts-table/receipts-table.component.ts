import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { DeleteReceiptDialogComponent } from "../../dialogs/delete-receipt-dialog/delete-receipt-dialog.component";
import { ReceiptDialogComponent } from "../../dialogs/receipt-dialog/receipt-dialog.component";

import { Receipt } from "../../../models/receipt.model";

import { DrawAccountsService } from "../../../services/draw-accounts.service";
import { LocationsService } from "../../../services/locations.service";
import { ReceiptsService } from "../../../services/receipts.service";

@Component({
  selector: 'app-receipts-table',
  templateUrl: './receipts-table.component.html',
  styleUrls: ['./receipts-table.component.css']
})
export class ReceiptsTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterControl = new FormControl('');

  subtotalTotal: number = 0;
  salesTaxTotal: number = 0;
  donationTotal: number = 0;

  displayedColumns: string[] = [
    'id',
    'date',
    'location',
    'subtotal',
    'salesTax',
    'donation',
    'drawAccount',
    'actions'
  ];

  dataSource = new MatTableDataSource<Receipt>();

  constructor(
    public dialog: MatDialog,
    public drawAccountService: DrawAccountsService,
    public locationService: LocationsService,
    public receiptsService: ReceiptsService
  ) {}

  ngAfterViewInit() {
    this.receiptsService.getReceipts().subscribe(resp => {
      this.dataSource.data = resp;
    });

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.filterByColumns();
  }

  private filterByColumns() {
    let filterFunction =
      (data: Receipt, filter: string): boolean => {
        if (filter && (
          data.id == Number(filter) ||
          data.subtotal?.toString().includes(filter) ||
          data.salesTax?.toString().includes(filter) ||
          data.donation?.toString().includes(filter) ||
          data.location?.name?.toLowerCase().includes(filter.toLowerCase()) ||
          data.drawAccount?.name?.toLowerCase().includes(filter.toLowerCase())
        )) {
          return true;
        } else {
          return false;
        }
      };

    return filterFunction;
  }

  public filterTable() {
    this.dataSource.filter = this.filterControl.value ? this.filterControl.value!.trim().toLowerCase() : '';
  }

  public calculateTotals(): void {
    this.subtotalTotal = 0;
    this.salesTaxTotal = 0;
    this.donationTotal = 0;

    this.dataSource.data.forEach((r: Receipt) => {
      this.subtotalTotal += r.subtotal!;
      this.salesTaxTotal += r.salesTax!;
      this.donationTotal += r.donation!;
    });

    console.log(this.subtotalTotal.toFixed(2), this.salesTaxTotal.toFixed(2), this.donationTotal.toFixed(2));
  }

  openDeleteDialog(receipt: Receipt | null) {
    const dialogRef = this.dialog.open(DeleteReceiptDialogComponent, {
      data: {receipt},
      height: '400px',
      width: '375px'
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.dataSource.data = this.dataSource.data.filter(r => r.id !== resp);
      }
    });
  }

  openReceiptDialog(receipt: Receipt | null, duplicate: boolean) {
    const dialogRef = this.dialog.open(ReceiptDialogComponent, {
      data: {receipt, duplicate},
      height: '800px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((dialogResponse: Receipt) => {
      if (dialogResponse) {
        if (!dialogResponse.location?.id) {
          this.createNewLocation(dialogResponse);
        } else if (!dialogResponse.drawAccount?.id) {
          this.createNewDrawAccount(dialogResponse);
        } else {
          this.createOrUpdateReceipt(dialogResponse);
        }
      }
    });
  }

  private createNewLocation(receipt: Receipt): void {
    this.locationService.createOrUpdateLocation(receipt.location!).subscribe(resp => {
      if (resp) {
        receipt.location = resp;

        if (!receipt.drawAccount?.id) {
          this.createNewDrawAccount(receipt);
        } else {
          this.createOrUpdateReceipt(receipt);
        }
      }
    });
  }

  private createNewDrawAccount(receipt: Receipt): void {
    this.drawAccountService.createOrUpdateDrawAccount(receipt.drawAccount!).subscribe(resp => {
      if (resp) {
        receipt.drawAccount = resp;
        this.createOrUpdateReceipt(receipt);
      }
    });
  }

  private createOrUpdateReceipt(receipt: Receipt): void {
    this.receiptsService.createOrUpdateReceipt(receipt).subscribe(resp => {
      if (resp) {
        /* If it has an id here, it already exists. */
        if (receipt.id) {
          /* receipt above will not update the row, so this has to happen. */
          let updatedReceipt = this.dataSource.data.find((r: Receipt) => r.id == receipt.id) as Receipt;

          updatedReceipt.date = resp.date;
          updatedReceipt.donation = resp.donation;
          updatedReceipt.drawAccount = resp.drawAccount;
          updatedReceipt.location = resp.location;
          updatedReceipt.salesTax = resp.salesTax;
          updatedReceipt.subtotal = resp.subtotal;
        } else {
          this.dataSource.data.push(resp);
        }

        this.dataSource._updateChangeSubscription();
      }
    });
  }
}
