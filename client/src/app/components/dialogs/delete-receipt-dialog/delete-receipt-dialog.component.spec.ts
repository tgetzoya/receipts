import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReceiptDialogComponent } from './delete-receipt-dialog.component';

describe('DeleteDialogComponent', () => {
  let component: DeleteReceiptDialogComponent;
  let fixture: ComponentFixture<DeleteReceiptDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteReceiptDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteReceiptDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
