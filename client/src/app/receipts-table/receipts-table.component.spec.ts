import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptsTableComponent } from './receipts-table.component';

describe('ReceiptsTableComponent', () => {
  let component: ReceiptsTableComponent;
  let fixture: ComponentFixture<ReceiptsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptsTableComponent]
    });
    fixture = TestBed.createComponent(ReceiptsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
