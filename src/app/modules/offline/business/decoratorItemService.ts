
import { Inject, Injectable } from '@angular/core';
import { OfflineService } from '../services/offline.service';
@Injectable()
export class DecoratorService {
     private static service: OfflineService | undefined = undefined;
     public constructor(service: OfflineService) {
         console.log('decorator service', service)
         DecoratorService.service = service;
     }
     public static getService(): OfflineService {
         if(!DecoratorService.service) {
             throw new Error('DecoratorService not initialized');
         }
         return DecoratorService.service;
     }
}



