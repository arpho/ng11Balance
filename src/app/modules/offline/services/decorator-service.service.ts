import { Injectable } from '@angular/core';
import { UsersService } from '../../user/services/users.service';

@Injectable()
export class DecoratorService {
     private static service: UsersService | undefined = undefined;
     public constructor(service: UsersService) {
         DecoratorService.service = service;
         console.log('ciao decoratorService')
     }
     public static getService(): UsersService {
         if(!DecoratorService.service) {
             throw new Error('DecoratorService not initialized');
         }
         return DecoratorService.service;
     }
}