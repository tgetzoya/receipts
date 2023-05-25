import { OnInit, Component, ViewChild} from '@angular/core';
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";

import { DrawAccountsService } from "../../../services/draw-accounts.service";
import { DeleteItemDialogComponent } from "../../dialogs/delete-item-dialog/delete-item-dialog.component";

import { DrawAccount } from "../../../models/draw-account.model";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-draw-accounts-table',
  templateUrl: './draw-accounts-table.component.html',
  styleUrls: ['./draw-accounts-table.component.css']
})
export class DrawAccountsTableComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'actions'
  ];

  filterControl = new FormControl('');

  dataSource = new MatTableDataSource<DrawAccount>();

  constructor( public dialog: MatDialog, public drawAccountsService: DrawAccountsService ) {}

  ngOnInit() {
    this.drawAccountsService.getDrawAccounts().subscribe((res) => {
      this.dataSource.data = res;
    });

    this.dataSource.sort = this.sort;
  }

  openDeleteDialog(drawAccount: DrawAccount) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {type: 'Location', name: drawAccount.name},
      height: '200px',
      width: '375px'
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.drawAccountsService.deleteDrawAccount(drawAccount.id).subscribe(resp => {
          this.dataSource.data = this.dataSource.data.filter(l => l.id != drawAccount.id);
        });
      }
    });
  }

  public filterTable() {
    this.dataSource.filter = this.filterControl.value ? this.filterControl.value.trim().toLowerCase() : '';
  }

  openLocationDialog(): void {

  }
}
