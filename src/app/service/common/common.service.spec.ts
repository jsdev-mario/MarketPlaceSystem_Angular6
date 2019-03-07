import { TestBed, inject } from '@angular/core/testing';

import { PostcodeService } from './postcode.service';

describe('PostcodeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostcodeService]
    });
  });

  it('should be created', inject([PostcodeService], (service: PostcodeService) => {
    expect(service).toBeTruthy();
  }));
});
