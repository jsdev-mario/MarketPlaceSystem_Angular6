import { TestBed, inject } from '@angular/core/testing';

import { ButcherService } from './butcher.service';

describe('ButcherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ButcherService]
    });
  });

  it('should be created', inject([ButcherService], (service: ButcherService) => {
    expect(service).toBeTruthy();
  }));
});
