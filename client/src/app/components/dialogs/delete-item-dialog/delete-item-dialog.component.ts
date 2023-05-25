import { OnInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DrawAccountsService } from "../../../services/draw-accounts.service";
import { LocationsService } from "../../../services/locations.service";

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-item-dialog.component.html',
  styleUrls: ['./delete-item-dialog.component.css']
})
export class DeleteItemDialogComponent implements OnInit {
  itemType!: string;
  itemName!: string;

  constructor(
    public dialogRef: MatDialogRef<DeleteItemDialogComponent>,
    public drawAccountsService: DrawAccountsService,
    public locationsService: LocationsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.itemType = this.data.type;
    this.itemName = this.data.name;
  }
}
