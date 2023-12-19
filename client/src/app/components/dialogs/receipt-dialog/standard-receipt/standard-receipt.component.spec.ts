import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardReceiptComponent } from './standard-receipt.component';

describe('StandardReceiptComponent', () => {
  let component: StandardReceiptComponent;
  let fixture: ComponentFixture<StandardReceiptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandardReceiptComponent]
    });
    fixture = TestBed.createComponent(StandardReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
