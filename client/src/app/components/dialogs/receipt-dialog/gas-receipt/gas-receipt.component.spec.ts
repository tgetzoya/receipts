import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasReceiptComponent } from './gas-receipt.component';

describe('GasReceiptComponent', () => {
  let component: GasReceiptComponent;
  let fixture: ComponentFixture<GasReceiptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GasReceiptComponent]
    });
    fixture = TestBed.createComponent(GasReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
