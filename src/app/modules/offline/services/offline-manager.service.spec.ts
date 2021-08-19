import { TestBed } from '@angular/core/testing';
import { offLineDbStatus } from '../models/offlineDbStatus';

import { OfflineManagerService } from './offline-manager.service';

describe('OfflineManagerService', () => {
  let service: OfflineManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    OfflineManagerService.servicesList=[]
    service = TestBed.inject(OfflineManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('status should be 0',()=>{
    OfflineManagerService.servicesList.push({offlineStatus:0})
    expect(OfflineManagerService.evaluateDbStatus()).toEqual(0)
  })
  it('status should be 1',()=>{
    
    OfflineManagerService.servicesList.push({offlineStatus:1})
    OfflineManagerService.servicesList.push({offlineStatus:1})
    expect(OfflineManagerService.evaluateDbStatus()).toEqual(offLineDbStatus.up2Date)

  })
  it('status should be 2',()=>{
    OfflineManagerService.servicesList.push({offlineStatus:0})
    OfflineManagerService.servicesList.push({offlineStatus:2})
    OfflineManagerService.servicesList.push({offlineStatus:1})
    OfflineManagerService.servicesList.push({offLineStatus:offLineDbStatus.syncing})
    expect(OfflineManagerService.evaluateDbStatus()).toEqual(offLineDbStatus.syncing)
  })
});
