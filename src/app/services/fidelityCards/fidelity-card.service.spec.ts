import { TestBed } from '@angular/core/testing';

import { FidelityCardService } from './fidelity-card.service';

describe('FidelityCardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FidelityCardService = TestBed.get(FidelityCardService);
    expect(service).toBeTruthy();
  });
});
