import { TestBed, inject } from '@angular/core/testing';

import { SiteInfoService } from './site-info.service';

describe('SiteInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SiteInfoService]
    });
  });

  it('should be created', inject([SiteInfoService], (service: SiteInfoService) => {
    expect(service).toBeTruthy();
  }));
});
