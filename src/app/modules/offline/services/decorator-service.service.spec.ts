import { TestBed } from '@angular/core/testing';

import { DecoratorService } from './decorator-service.service';

describe('DecoratorService', () => {
  let service: DecoratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[DecoratorService]
    });

  });

  it('should be created', () => {
    const service:DecoratorService = TestBed.get(DecoratorService);
    expect(service).toBeTruthy();
  });
});
