import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteItemDialogComponent } from './delete-item-dialog.component';

describe('DeleteDialogComponent', () => {
  let component: DeleteItemDialogComponent;
  let fixture: ComponentFixture<DeleteItemDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteItemDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
