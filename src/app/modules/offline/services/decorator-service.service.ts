import { Injectable } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories/categorie.service';

@Injectable()
export class DecoratorService {
     private static service: CategoriesService | undefined = undefined;
     public constructor(service: CategoriesService) {
         DecoratorService.service = service;
         console.log('ciao decoratorService')
     }
     public static getService(): CategoriesService {
         if(!DecoratorService.service) {
             throw new Error('DecoratorService not initialized');
         }
         return DecoratorService.service;
     }
}