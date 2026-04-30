import { TestBed } from '@angular/core/testing';

import { LoginEventService } from './login-event.service';

describe('LoginEventService', () => {
  let service: LoginEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
