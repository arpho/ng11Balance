import { TestBed } from '@angular/core/testing';

import { OfflineManagerService } from './offline-manager.service';

describe('OfflineManagerService', () => {
  let service: OfflineManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
