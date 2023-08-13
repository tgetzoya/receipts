import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

import { DrawAccountsService } from "../../../services/draw-accounts.service";
import { DeleteItemDialogComponent } from "../../dialogs/delete-item-dialog/delete-item-dialog.component";

import { DrawAccount } from "../../../models/draw-account.model";
import { FormControl } from "@angular/forms";

import { DrawAccountDialogComponent } from "../../dialogs/draw-account-dialog/draw-account-dialog.component";

@Component({
  selector: 'app-draw-accounts-view',
  templateUrl: './draw-accounts-view.component.html',
  styleUrls: ['./draw-accounts-view.component.css']
})
export class DrawAccountsViewComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterControl = new FormControl('');

  displayedColumns: string[] = [
    'id',
    'name',
    'actions'
  ];

  dataSource = new MatTableDataSource<DrawAccount>();

  constructor(
    public dialog: MatDialog,
    public drawAccountsService: DrawAccountsService
  ) {}

  ngAfterViewInit() {
    this.drawAccountsService.getDrawAccounts().subscribe((res) => {
      this.dataSource.data = res;
    });

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openDeleteDialog(drawAccount: DrawAccount) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {type: 'Location', name: drawAccount.name},
      height: '200px',
      width: '375px'
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.drawAccountsService.deleteDrawAccount(drawAccount.id!).subscribe(resp => {
          this.dataSource.data = this.dataSource.data.filter(l => l.id != drawAccount.id);
        });
      }
    });
  }

  public filterTable() {
    this.dataSource.filter = this.filterControl.value ? this.filterControl.value.trim().toLowerCase() : '';
  }

  openDrawAccountDialog(editDrawAccount?: DrawAccount): void {
    const dialogRef = this.dialog.open(DrawAccountDialogComponent, {
      data: {drawAccount: editDrawAccount, existingDrawAccounts: this.dataSource.data},
      height: '275px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(dialogResponse => {
      if (dialogResponse) {
        this.drawAccountsService.createOrUpdateDrawAccount(dialogResponse).subscribe(createOrUpdateResponse => {
          if (createOrUpdateResponse) {
            if (editDrawAccount) {
              console.log('YES?', editDrawAccount)
              let drawAccount = this.dataSource.data.find(a => a.id == createOrUpdateResponse.id);

              console.log('No?', drawAccount);

              if (drawAccount) {
                drawAccount.name = createOrUpdateResponse.name;
              }
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
