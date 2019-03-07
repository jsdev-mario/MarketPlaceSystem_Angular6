import { TestBed, inject } from '@angular/core/testing';

import { StocklistService } from './stocklist.service';

describe('StocklistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StocklistService]
    });
  });

  it('should be created', inject([StocklistService], (service: StocklistService) => {
    expect(service).toBeTruthy();
  }));
});
