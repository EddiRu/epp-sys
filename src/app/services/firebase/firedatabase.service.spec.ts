import { TestBed } from '@angular/core/testing';

import { FiredatabaseService } from './firedatabase.service';

describe('FiredatabaseService', () => {
  let service: FiredatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiredatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
