import { TestBed } from '@angular/core/testing';
import { CategoriesService } from 'src/app/services/categories/categorie.service';
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
    const service = new CategoriesService()
    service.offlineStatus=0
    OfflineManagerService.servicesList.push(service)
    expect(OfflineManagerService.evaluateDbStatus()).toEqual(0)
  })
  it('status should be 1',()=>{
    
    OfflineManagerService.servicesList.push(new CategoriesService().setOfflineStatus(1))
    OfflineManagerService.servicesList.push(new CategoriesService().setOfflineStatus(1))
    expect(OfflineManagerService.evaluateDbStatus()).toEqual(offLineDbStatus.up2Date)

  })
  it('status should be 2',()=>{
    OfflineManagerService.servicesList.push(new CategoriesService().setOfflineStatus(1))
    OfflineManagerService.servicesList.push(new CategoriesService().setOfflineStatus(2))
    OfflineManagerService.servicesList.push(new CategoriesService().setOfflineStatus(1))
    OfflineManagerService.servicesList.push(new CategoriesService().setOfflineStatus(2))
    expect(OfflineManagerService.evaluateDbStatus()).toEqual(offLineDbStatus.syncing)
  })
});
