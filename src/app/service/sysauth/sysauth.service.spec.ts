import { TestBed, inject } from '@angular/core/testing';

import { SysAuthService } from './sysauth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SysAuthService]
    });
  });

  it('should be created', inject([SysAuthService], (service: SysAuthService) => {
    expect(service).toBeTruthy();
  }));
});
