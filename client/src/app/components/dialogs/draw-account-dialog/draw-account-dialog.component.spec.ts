import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAccountDialogComponent } from './draw-account-dialog.component';

describe('DrawAccountDialogComponent', () => {
  let component: DrawAccountDialogComponent;
  let fixture: ComponentFixture<DrawAccountDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DrawAccountDialogComponent]
    });
    fixture = TestBed.createComponent(DrawAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
