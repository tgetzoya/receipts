import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReceiptsService } from "../../../services/receipts.service";

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-receipt-dialog.component.html',
  styleUrls: ['./delete-receipt-dialog.component.css']
})
export class DeleteReceiptDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteReceiptDialogComponent>,
    public receiptsService: ReceiptsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  public delete(): void {
    this.receiptsService.deleteReceipt(this.data.receipt.id).subscribe(resp => {
      this.dialogRef.close(this.data.receipt.id);
    })
  }
}
