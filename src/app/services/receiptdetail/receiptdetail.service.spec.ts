import { TestBed } from '@angular/core/testing';

import { ReceiptdetailService } from './receiptdetail.service';

describe('ReceiptdetailService', () => {
  let service: ReceiptdetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptdetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
