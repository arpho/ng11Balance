import { Injectable } from '@angular/core';
import { ItemServiceInterface } from '../../item/models/ItemServiceInterface';
import { UsersService } from '../../user/services/users.service';
import {OfflineManagerService} from './offline-manager.service'

@Injectable()
export class DecoratorService {
     private static services;
     public constructor(service: UsersService,manager:OfflineManagerService) {
         
     }
     public static getService(serviceKey:string): ItemServiceInterface|OfflineManagerService {
        /*  if(!DecoratorService.service.user) {
             throw new Error('DecoratorService not initialized');
         } */
         DecoratorService.services = {'user':UsersService,
        'manager':OfflineManagerService};
         return DecoratorService.services[serviceKey];
     }
}