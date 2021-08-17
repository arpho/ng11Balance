import { Injectable } from '@angular/core';
import { OfflineItemServiceInterface } from '../models/offlineItemServiceInterface';

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
servicesList:Array<OfflineItemServiceInterface>=[]
  constructor() { }

  registerService(service:OfflineItemServiceInterface){
    this.servicesList.push(service)
  }
}
