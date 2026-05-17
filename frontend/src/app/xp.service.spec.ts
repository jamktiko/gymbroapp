import { TestBed } from '@angular/core/testing';

import { XpService } from './xp.service';

describe('XpService', () => {
  let service: XpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
