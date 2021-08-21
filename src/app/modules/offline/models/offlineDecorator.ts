import {DecoratorService} from '../services/decorator-service.service'
import { OfflineManagerService } from '../services/offline-manager.service'
import { OfflineItemModelInterface } from './offlineItemModelInterface'
import { OfflineItemServiceInterface } from './offlineItemServiceInterface'
export function Offline<OfflineItemServiceInterface extends {new (...args:any[]):{}}>(constr:OfflineItemServiceInterface){
  
   OfflineManagerService.registerService(constr)
   console.log("-- decorator function invoked --");
   return class extends constr{
      constructor(...args:any[]){
         super(...args)
         console.log('decorated')
      }
      
      
     
   }
}