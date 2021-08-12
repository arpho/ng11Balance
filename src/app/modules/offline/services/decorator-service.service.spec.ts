import { TestBed } from '@angular/core/testing';

import { DecoratorServiceService } from './decorator-service.service';

describe('DecoratorServiceService', () => {
  let service: DecoratorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoratorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
