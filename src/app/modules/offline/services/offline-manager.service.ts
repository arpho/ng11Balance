import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { offLineDbStatus } from '../models/offlineDbStatus';
import { OfflineItemServiceInterface } from '../models/offlineItemServiceInterface';

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  servicesList: Array<OfflineItemServiceInterface> = []
  _offlineDbStatus: BehaviorSubject<offLineDbStatus> = new BehaviorSubject(0)
  readonly offlineDbStatus: Observable<offLineDbStatus> = this._offlineDbStatus.asObservable()
  constructor() { }

  registerService(service: OfflineItemServiceInterface) {
    this.servicesList.push(service)
    console.log('registered service',service)
  }
}
