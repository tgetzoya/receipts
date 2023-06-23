import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAccountsViewComponent } from './draw-accounts-view.component';

describe('DrawAccountsTableComponent', () => {
  let component: DrawAccountsViewComponent;
  let fixture: ComponentFixture<DrawAccountsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawAccountsViewComponent]
    });
    fixture = TestBed.createComponent(DrawAccountsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
