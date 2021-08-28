import { UsersService } from '../../user/services/users.service';
import { decoratedCreate, decoratedDelete, decoratedUpdate } from '../business/decoratedOperations';
import { OfflineDbService } from '../services/offline-db.service';
import { OfflineManagerService } from '../services/offline-manager.service'
import { OfflineItemModelInterface } from './offlineItemModelInterface'
import { OfflineItemServiceInterface } from './offlineItemServiceInterface'
import { OperationKey } from './operationKey';

export function offline(operation: OperationKey,entityLabel?:string): (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void {
   console.log('decorating', operation)
   const out = {}
   out[OperationKey.update] = decoratedUpdate
   out[OperationKey.create] = decoratedCreate
   out[OperationKey.delete]= decoratedDelete(entityLabel)

   return out[operation]
}