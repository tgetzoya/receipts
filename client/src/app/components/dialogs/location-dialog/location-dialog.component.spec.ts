import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDialogComponent } from './location-dialog.component';

describe('LocationDialogComponent', () => {
  let component: LocationDialogComponent;
  let fixture: ComponentFixture<LocationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationDialogComponent]
    });
    fixture = TestBed.createComponent(LocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
