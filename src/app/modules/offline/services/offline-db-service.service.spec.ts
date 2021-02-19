import { TestBed } from '@angular/core/testing';

import { OfflineDbServiceService } from './offline-db-service.service';

describe('OfflineDbServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfflineDbServiceService = TestBed.get(OfflineDbServiceService);
    expect(service).toBeTruthy();
  });
});
