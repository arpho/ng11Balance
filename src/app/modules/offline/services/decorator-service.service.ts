import { Injectable } from '@angular/core';
import { ItemServiceInterface } from '../../item/models/ItemServiceInterface';
import { UsersService } from '../../user/services/users.service';
import {OfflineManagerService} from './offline-manager.service'

@Injectable()
export class DecoratorService {
     private static service;
     public constructor(service: UsersService) {
         DecoratorService.service = {'user':UsersService,
        'manager':OfflineManagerService};
         console.log('ciao decoratorService')
     }
     public static getService(serviceKey:string): ItemServiceInterface|OfflineManagerService {
         if(!DecoratorService.service) {
             throw new Error('DecoratorService not initialized');
         }
         return DecoratorService.service[serviceKey];
     }
}