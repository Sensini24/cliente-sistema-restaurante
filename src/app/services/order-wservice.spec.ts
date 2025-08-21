import { TestBed } from '@angular/core/testing';

import { OrderWService } from './order-wservice';

describe('OrderWService', () => {
  let service: OrderWService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderWService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
