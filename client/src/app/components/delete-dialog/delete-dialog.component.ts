import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReceiptsService } from "../../services/receipts.service";

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    public receiptsService: ReceiptsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  public delete(): void {
    this.receiptsService.deleteReceipt(this.data.receipt.id).subscribe(resp => {
      this.dialogRef.close(this.data.receipt.id);
    })
  }
}
