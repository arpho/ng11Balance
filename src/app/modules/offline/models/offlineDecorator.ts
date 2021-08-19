import {DecoratorService} from '../services/decorator-service.service'
import { OfflineManagerService } from '../services/offline-manager.service'
import { OfflineItemModelInterface } from './offlineItemModelInterface'
import { OfflineItemServiceInterface } from './offlineItemServiceInterface'
export function Offline<OfflineItemServiceInterface extends {new (...constructorArgs:any[])}>(constructorFunction:OfflineItemServiceInterface){
   console.log('arguments')
   OfflineManagerService.registerService(constructorFunction)
}