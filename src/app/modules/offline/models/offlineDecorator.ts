import { OfflineManagerService } from '../services/offline-manager.service'
import { OfflineItemModelInterface } from './offlineItemModelInterface'
import { OfflineItemServiceInterface } from './offlineItemServiceInterface'


type Constructor<T = {}> = new (...args: any[]) => T;
export function Offline<OfflineItemServiceInterface extends Constructor>(constr:OfflineItemServiceInterface){
  
   OfflineManagerService.registerService(constr)
   console.log("-- decorator function invoked --");
   return class extends constr{
      constructor(...args:any[]){
         super(...args)
         console.log('decorated')
      }
   }
}
      
      
     