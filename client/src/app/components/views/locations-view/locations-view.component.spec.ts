import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsViewComponent } from './locations-view.component';

describe('LocationsTableComponent', () => {
  let component: LocationsViewComponent;
  let fixture: ComponentFixture<LocationsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationsViewComponent]
    });
    fixture = TestBed.createComponent(LocationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
