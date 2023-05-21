import {Component, AfterViewInit, ViewChild} from '@angular/core';

import { Receipt } from "../models/receipt.model";
import { ReceiptsService } from "../services/receipts.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";

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
    'drawAccount'
  ];

  dataSource = new MatTableDataSource<Receipt>();

  constructor( public receiptsService: ReceiptsService ) {}

  ngAfterViewInit() {
    this.receiptsService.getReceipts().subscribe((res) => {
      this.dataSource.data = res;
    });

    this.dataSource.sort = this.sort;
  }
}
