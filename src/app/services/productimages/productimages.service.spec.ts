import { TestBed } from '@angular/core/testing';

import { ProductimagesService } from './productimages.service';

describe('ProductimagesService', () => {
  let service: ProductimagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductimagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
