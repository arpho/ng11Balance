import { UsersService } from '../../user/services/users.service';
import { OfflineDbService } from '../services/offline-db.service';
import { OfflineManagerService } from '../services/offline-manager.service'
import { OfflineItemModelInterface } from './offlineItemModelInterface'
import { OfflineItemServiceInterface } from './offlineItemServiceInterface'
import { operationKey } from './operationKey';

export function  offline(operation:operationKey):any{
   console.log('decorating',operation)
   return (target: Object, 
      propertyKey: string, 
      descriptor: TypedPropertyDescriptor<any>)=>{
         if (navigator.onLine) {
            console.log('online');
          } else {
            console.log('offline');
          }
      console.log('decorated target ',target)
      console.log('property key',propertyKey)
      console.log('descriptor',descriptor)
      console.log('descriptor value',descriptor.value)
      const childFunction = descriptor.value;
      descriptor.value =async (...args: any[])=> {
         console.log('args',args)
         childFunction.apply(target.constructor, args);
         return descriptor
      }
   }
}