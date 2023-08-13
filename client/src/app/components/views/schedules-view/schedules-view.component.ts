import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";

import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Schedule } from "../../../models/schedule.model";
import { ScheduleService } from "../../../services/schedule.service";
import { ReceiptDialogComponent } from "../../dialogs/receipt-dialog/receipt-dialog.component";

@Component({
  selector: 'app-schedules-view',
  templateUrl: './schedules-view.component.html',
  styleUrls: ['./schedules-view.component.css']
})
export class SchedulesViewComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<Schedule>();

  filterControl = new FormControl('');

  displayedColumns: string[] = [
    'id',
    'interval',
    'nextDate',
    'location',
    'subtotal',
    'salesTax',
    'donation',
    'drawAccount',
    'actions'
  ];

  constructor(
    public dialog: MatDialog,
    public schedulesService: ScheduleService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.schedulesService.getScheduledTasks().subscribe(resp => {
      if (resp) {
        this.dataSource.data = resp;
      }
    });

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Schedule, filter: string): boolean => {
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

  public filterTable(): void {
    this.dataSource.filter = this.filterControl.value ? this.filterControl.value!.trim().toLowerCase() : '';
  }

  public openSchedule(schedule: Schedule): void {
    const dialogRef = this.dialog.open(ReceiptDialogComponent, {
      data: {schedule},
      height: '*',
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.schedulesService.updateSchedule(resp).subscribe(resp => {
          if (resp) {
            let found: Schedule | undefined = this.dataSource.data.find((s: Schedule) => s.id == resp.id);

            if (found) {
              found.nextDate = resp.nextDate;
              found.donation = resp.donation;
              found.drawAccount = resp.drawAccount;
              found.location = resp.location;
              found.salesTax = resp.salesTax;
              found.subtotal = resp.subtotal;
            }

            this.snackBar.open("Schedule successfully updated.");
          } else {
            this.snackBar.open("Schedule could not be updated.");
          }
        });
      }
    });
  }

  public deleteSchedule(schedule: Schedule): void {
    this.schedulesService.deleteSchedule(schedule.id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(s => s.id != schedule.id);
    });
  }
}
