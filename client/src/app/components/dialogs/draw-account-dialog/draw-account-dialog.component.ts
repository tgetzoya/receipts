import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { DrawAccount } from "../../../models/draw-account.model";

export function nonExistingValidator(existingAccounts: DrawAccount[]): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const exists = existingAccounts.find(a => a.name?.toLowerCase() === value.toLowerCase());

    return exists ? {exists:exists.name}: null;
  }
}

@Component({
  selector: 'app-draw-account-dialog',
  templateUrl: './draw-account-dialog.component.html',
  styleUrls: ['./draw-account-dialog.component.css']
})
export class DrawAccountDialogComponent implements  OnInit {
  nameControl = new FormControl('', {
    validators: [Validators.required, nonExistingValidator(this.data.existingDrawAccounts)],
    updateOn: 'change'
  });

  constructor(
    public dialogRef: MatDialogRef<DrawAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    if (this.data.drawAccount) {
      this.nameControl.setValue(this.data.drawAccount.name);
    }
  }

  createOrUpdateDrawAccount() {
    if (this.nameControl.invalid) {
      this.nameControl.markAsTouched();
      return;
    }

    let newOrUpdatedDrawAccount = new DrawAccount();
    newOrUpdatedDrawAccount.name = this.nameControl.value!;

    if (this.data.drawAccount) {
      newOrUpdatedDrawAccount.id = this.data.drawAccount.id;
    }

    this.dialogRef.close(newOrUpdatedDrawAccount);
  }
}
