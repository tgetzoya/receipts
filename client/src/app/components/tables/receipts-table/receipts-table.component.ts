import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

import { DeleteReceiptDialogComponent } from "../../dialogs/delete-receipt-dialog/delete-receipt-dialog.component";
import { Receipt } from "../../../models/receipt.model";
import { ReceiptDialogComponent } from "../../dialogs/receipt-dialog/receipt-dialog.component";
import { ReceiptsService } from "../../../services/receipts.service";

@Component({
  selector: 'app-receipts-table',
  templateUrl: './receipts-table.component.html',
  styleUrls: ['./receipts-table.component.css']
})
export class ReceiptsTableComponent implements AfterViewInit {
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
    const dialogRef = this.dialog.open(DeleteReceiptDialogComponent, {
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

    dialogRef.afterClosed().subscribe(dialogResponse => {
      if (dialogResponse) {
        this.receiptsService.createOrUpdateReceipt(dialogResponse).subscribe(createOrUpdateResponse => {
          if (createOrUpdateResponse) {
            if (receipt) {
              receipt.date = createOrUpdateResponse.date;
              receipt.donation = createOrUpdateResponse.donation;
              receipt.drawAccount = createOrUpdateResponse.drawAccount;
              receipt.location = createOrUpdateResponse.location;
              receipt.salesTax = createOrUpdateResponse.salesTax;
              receipt.subtotal = createOrUpdateResponse.subtotal;
            } else {
              this.dataSource.data.push(createOrUpdateResponse);
              this.dataSource._updateChangeSubscription();
            }
          }
        });
      }
    });
  }
}
