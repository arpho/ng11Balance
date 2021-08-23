import { OfflineDbService } from '../services/offline-db.service';
import { OfflineManagerService } from '../services/offline-manager.service'
import { OfflineItemModelInterface } from './offlineItemModelInterface'
import { OfflineItemServiceInterface } from './offlineItemServiceInterface'
import { operationKey } from './operationKey';

export function  offline(operation:operationKey):any{
   console.log('decorating')
   return (target: Object, 
      propertyKey: string, 
      descriptor: TypedPropertyDescriptor<any>)=>{
      console.log('decorated target ',target)
      console.log('property key',propertyKey)
      console.log('descriptor',descriptor)
   }
}