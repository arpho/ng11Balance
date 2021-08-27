import { UsersService } from '../../user/services/users.service';
import { decoratedUpdate } from '../business/decoratedUpdate';
import { OfflineDbService } from '../services/offline-db.service';
import { OfflineManagerService } from '../services/offline-manager.service'
import { OfflineItemModelInterface } from './offlineItemModelInterface'
import { OfflineItemServiceInterface } from './offlineItemServiceInterface'
import { OperationKey } from './operationKey';

export function offline(operation: OperationKey): any {
   console.log('decorating', operation)
   //  var out:(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => void
   const out = {}
   out[OperationKey.update] = decoratedUpdate

   return out[operation]
}