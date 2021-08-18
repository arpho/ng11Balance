import { TestBed } from '@angular/core/testing';

import { OfflineDbService } from './offline-db.service';

describe('OfflineDbService', () => {
  let service: OfflineDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
