import { Component, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

import { DeleteDialogComponent } from "../delete-dialog/delete-dialog.component";
import { Receipt } from "../../models/receipt.model";
import { ReceiptDialogComponent } from "../receipt-dialog/receipt-dialog.component";
import { ReceiptsService } from "../../services/receipts.service";

@Component({
  selector: 'app-receipts-table',
  templateUrl: './receipts-table.component.html',
  styleUrls: ['./receipts-table.component.css']
})
export class ReceiptsTableComponent {
  @ViewChild(MatSort) sort!: MatSort;

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

  constructor( public dialog: MatDialog, public receiptsService: ReceiptsService ) {}

  ngAfterViewInit() {
    this.receiptsService.getReceipts().subscribe((res) => {
      this.dataSource.data = res;
    });

    this.dataSource.sort = this.sort;
  }

  openDeleteDialog(receipt: Receipt | null) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {receipt},
      height: '400px',
      width: '375px'
    });

    dialogRef.afterClosed().subscribe(resp => {
      this.dataSource.data = this.dataSource.data.filter(r => r.id !== resp);
    });
  }

  openReceiptDialog(receipt: Receipt | null, duplicate: boolean) {
    const dialogRef = this.dialog.open(ReceiptDialogComponent, {
      data: {receipt, duplicate},
      height: '800px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (!resp) {
        return;
      }

      let receipt = this.dataSource.data.find(r => r.id === resp.id);

      if (receipt) {
        receipt.date = resp.date;
        receipt.donation = resp.donation;
        receipt.drawAccount = resp.drawAccount;
        receipt.location = resp.location;
        receipt.salesTax = resp.salesTax;
        receipt.subtotal = resp.subtotal;
      } else {
        this.dataSource.data.push(resp);
        this.dataSource._updateChangeSubscription();
      }
    });
  }
}
