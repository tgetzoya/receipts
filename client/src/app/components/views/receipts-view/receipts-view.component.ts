import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl } from "@angular/forms";

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";

import { DeleteReceiptDialogComponent } from "../../dialogs/delete-receipt-dialog/delete-receipt-dialog.component";
import { ReceiptDialogComponent } from "../../dialogs/receipt-dialog/receipt-dialog.component";

import { Note } from "../../../models/note.model";
import { Receipt } from "../../../models/receipt.model";

import { DrawAccountsService } from "../../../services/draw-accounts.service";
import { LocationsService } from "../../../services/locations.service";
import { NotesService } from "../../../services/notes.service";
import { ReceiptsService } from "../../../services/receipts.service";
import { ScheduleService } from "../../../services/schedule.service";

@Component({
  selector: 'app-receipts-view',
  templateUrl: './receipts-view.component.html',
  styleUrls: ['./receipts-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReceiptsViewComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  expandedRow?: Receipt | null;
  notes?: Note[] | null;
  recordYears: string[] = [];

  filterControl = new FormControl('');
  yearControl = new FormControl();

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
    public notesService: NotesService,
    public receiptsService: ReceiptsService,
    public scheduleService: ScheduleService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.yearControl.valueChanges.subscribe((year) => {
      localStorage.setItem("receiptYear", year);
      this.updateTable(year);
    });

    this.receiptsService.getReceiptYears().subscribe( resp => {
      if (resp) {
        resp.forEach(year => this.recordYears.push(year.toString()));
      } else {
        this.recordYears.push(new Date().getFullYear().toString());
      }

      /* If the stored value is in _both_ the localstorage and there are receipts to display. */
      if ("receiptYear" in localStorage && "receiptYear" in this.recordYears) {
        this.yearControl.setValue(localStorage.getItem("receiptYear"));
      } else {
        this.yearControl.setValue(this.recordYears[0]);
      }
    });

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Receipt, filter: string): boolean => {
      return !!(filter && (
        data.id == Number(filter) ||
        data.subtotal?.toString().includes(filter) ||
        data.salesTax?.toString().includes(filter) ||
        data.donation?.toString().includes(filter) ||
        data.location?.name?.toLowerCase().includes(filter.toLowerCase()) ||
        data.drawAccount?.name?.toLowerCase().includes(filter.toLowerCase())
      ));
    };
  }

  updateTable(year: string) {
    this.receiptsService.getReceipts(year).subscribe(resp => {
      this.dataSource.data = resp;
    });
  }

  public filterTable(): void {
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
      height: '*',
      width: '650px'
    });

    dialogRef.afterClosed().subscribe((dialogResponse: any) => {
      if (dialogResponse) {
        let receipt = dialogResponse.receipt;

        if (!receipt.location?.id) {
          this.createNewLocation(receipt);
        } else if (!receipt.drawAccount?.id) {
          this.createNewDrawAccount(receipt);
        } else {
          this.createOrUpdateReceipt(receipt);
        }

        if (dialogResponse.schedule) {
          if (dialogResponse.schedule.interval === 'NONE' && dialogResponse.schedule.id) {
            this.scheduleService.deleteSchedule(dialogResponse.schedule.id);
          } else {
            this.scheduleService.createSchedule(dialogResponse.schedule).subscribe(resp => {
              if (resp) {
                this.snackBar.open("Schedule successfully created.");
              } else {
                this.snackBar.open("Schedule could not be created.");
              }
            });
          }
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
          let updatedReceipt = this.dataSource.data.find((r: Receipt) => r.id == receipt.id);

          if (updatedReceipt) {
            updatedReceipt.date = resp.date;
            updatedReceipt.donation = resp.donation;
            updatedReceipt.drawAccount = resp.drawAccount;
            updatedReceipt.location = resp.location;
            updatedReceipt.salesTax = resp.salesTax;
            updatedReceipt.subtotal = resp.subtotal;
          }
        } else {
          this.dataSource.data.push(resp);
        }

        this.dataSource._updateChangeSubscription();
      }
    });
  }

  showNote(row: Receipt): void {
    this.notes = null;

    /* if it's already open, then close it. */
    if (this.expandedRow == row) {
      this.expandedRow = undefined;
    } else {
      this.expandedRow = row;
    }
  }
}
