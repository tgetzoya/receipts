import { OnInit, Component, ViewChild} from '@angular/core';
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";

import { LocationsService } from "../../../services/locations.service";
import { DeleteItemDialogComponent } from "../../dialogs/delete-item-dialog/delete-item-dialog.component";

import { Location } from "../../../models/location.model";
import { FormControl } from "@angular/forms";
import { LocationDialogComponent } from "../../dialogs/location-dialog/location-dialog.component";

@Component({
  selector: 'app-locations-table',
  templateUrl: './locations-table.component.html',
  styleUrls: ['./locations-table.component.css']
})
export class LocationsTableComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'actions'
  ];

  filterControl = new FormControl('');

  dataSource = new MatTableDataSource<Location>();

  constructor( public dialog: MatDialog, public locationsService: LocationsService ) {}

  ngOnInit() {
    this.locationsService.getLocations().subscribe((res) => {
      this.dataSource.data = res;
    });

    this.dataSource.sort = this.sort;
  }

  openDeleteDialog(location: Location) {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      data: {type: 'Location', name: location.name},
      height: '200px',
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(resp => {
      if (resp) {
        this.locationsService.deleteLocation(location.id!).subscribe(resp => {
          this.dataSource.data = this.dataSource.data.filter(l => l.id != location.id);
        });
      }
    });
  }

  public filterTable() {
    this.dataSource.filter = this.filterControl.value ? this.filterControl.value!.trim().toLowerCase() : '';
  }

  openLocationDialog(editLocation?: Location): void {
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      data: {location: editLocation, existingLocations: this.dataSource.data},
      height: '275px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(dialogResponse => {
      if (dialogResponse) {
        this.locationsService.createOrUpdateLocation(dialogResponse).subscribe(createOrUpdateResponse => {
          if (createOrUpdateResponse) {
            if (editLocation) {
              let location = this.dataSource.data.find(l => l.id == createOrUpdateResponse.id);

              if (location) {
                location.name = location.name = createOrUpdateResponse.name;
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
