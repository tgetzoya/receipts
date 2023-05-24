import { TestBed } from '@angular/core/testing';

import { DrawAccountsService } from './draw-accounts.service';

describe('DrawAccountsService', () => {
  let service: DrawAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
