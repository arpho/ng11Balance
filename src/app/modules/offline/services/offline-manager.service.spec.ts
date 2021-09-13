import { TestBed } from '@angular/core/testing';
import { chdir } from 'process';
import { CategoriesService } from 'src/app/services/categories/categorie.service';
import { UsersService } from '../../user/services/users.service';
import { offLineDbStatus } from '../models/offlineDbStatus';
import { ChangesService } from './changes.service';
import { ConnectionStatusService } from './connection-status.service';
import { OfflineDbService } from './offline-db.service';

import { OfflineManagerService } from './offline-manager.service';

describe('OfflineManagerService', () => {
  let service: OfflineManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    OfflineManagerService.servicesList = []
    service = TestBed.inject(OfflineManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('status should be 0', () => {
    const service = new CategoriesService(new OfflineManagerService(new OfflineDbService(),new UsersService(),new ChangesService(),new ConnectionStatusService()),  new OfflineDbService(), new ChangesService())
    service.offlineDbStatus = 0
    OfflineManagerService.servicesList.push(service)
    expect(OfflineManagerService.evaluateDbStatus()).toEqual(0)
  })
  it('status should be 1', () => {

    OfflineManagerService.servicesList.push(new CategoriesService(new OfflineManagerService(new OfflineDbService(), new UsersService(),new ChangesService(), new ConnectionStatusService()), new OfflineDbService(), new ChangesService()).setOfflineStatus(1))
    OfflineManagerService.servicesList.push(new CategoriesService(new OfflineManagerService(new OfflineDbService(), new UsersService(), new ChangesService(),new ConnectionStatusService()), new OfflineDbService(), new ChangesService()).setOfflineStatus(1))
    expect(OfflineManagerService.evaluateDbStatus()).toEqual(offLineDbStatus.up2Date)

  })
  it('status should be 2', () => {
    OfflineManagerService.servicesList.push(new CategoriesService(new OfflineManagerService(new OfflineDbService(), new UsersService(),new ChangesService(),new ConnectionStatusService()),  new OfflineDbService(), new ChangesService()).setOfflineStatus(1))
    OfflineManagerService.servicesList.push(new CategoriesService(new OfflineManagerService(new OfflineDbService(), new UsersService(),new ChangesService(),new ConnectionStatusService()),  new OfflineDbService(), new ChangesService()).setOfflineStatus(2))
    OfflineManagerService.servicesList.push(new CategoriesService(new OfflineManagerService(new OfflineDbService(), new UsersService(), new ChangesService(), new ConnectionStatusService()),  new OfflineDbService(), new ChangesService()).setOfflineStatus(1))
    OfflineManagerService.servicesList.push(new CategoriesService(new OfflineManagerService(new OfflineDbService(), new UsersService(), new ChangesService, new ConnectionStatusService()),  new OfflineDbService(), new ChangesService()).setOfflineStatus(2))
    expect(OfflineManagerService.evaluateDbStatus()).toEqual(offLineDbStatus.syncing)
  })
});
