import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { Location } from "../../../models/location.model";

export function nonExistingValidator(existingLocations: Location[]): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const exists = existingLocations.find(l => l.name?.toLowerCase() === value.toLowerCase());

    return exists ? {exists:exists.name}: null;
  }
}

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css']
})
export class LocationDialogComponent implements  OnInit {
  nameControl = new FormControl('', {
    validators: [Validators.required, nonExistingValidator(this.data.existingLocations)],
    updateOn: 'change'
  });

  constructor(
    public dialogRef: MatDialogRef<LocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit() {
    if (this.data.location) {
      this.nameControl.setValue(this.data.location.name);
    }
  }

  createOrUpdateLocation() {
    if (this.nameControl.invalid) {
      this.nameControl.markAsTouched();
      return;
    }

    let newOrUpdatedLocation = new Location();
    newOrUpdatedLocation.name = this.nameControl.value!;

    if (this.data.location) {
      newOrUpdatedLocation.id = this.data.location.id;
    }

    this.dialogRef.close(newOrUpdatedLocation);
  }
}
