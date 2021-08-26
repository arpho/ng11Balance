import { UsersService } from '../../user/services/users.service';
import { decoratedUpdate } from '../business/decoratedUpdate';
import { OfflineDbService } from '../services/offline-db.service';
import { OfflineManagerService } from '../services/offline-manager.service'
import { OfflineItemModelInterface } from './offlineItemModelInterface'
import { OfflineItemServiceInterface } from './offlineItemServiceInterface'
import { OperationKey } from './operationKey';

export function offline(operation: OperationKey): any {
   console.log('decorating', operation)
   return decoratedUpdate
}