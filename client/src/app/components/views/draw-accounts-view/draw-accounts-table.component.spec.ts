import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAccountsTableComponent } from './draw-accounts-table.component';

describe('DrawAccountsTableComponent', () => {
  let component: DrawAccountsTableComponent;
  let fixture: ComponentFixture<DrawAccountsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawAccountsTableComponent]
    });
    fixture = TestBed.createComponent(DrawAccountsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
