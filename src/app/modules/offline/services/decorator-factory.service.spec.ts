import { TestBed } from '@angular/core/testing';

import { DecoratorFactoryService } from './decorator-factory.service';

describe('DecoratorFactoryService', () => {
  let service: DecoratorFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecoratorFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
