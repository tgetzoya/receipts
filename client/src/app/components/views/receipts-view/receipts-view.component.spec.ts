import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptsViewComponent } from './receipts-view.component';

describe('ReceiptsTableComponent', () => {
  let component: ReceiptsViewComponent;
  let fixture: ComponentFixture<ReceiptsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiptsViewComponent]
    });
    fixture = TestBed.createComponent(ReceiptsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
