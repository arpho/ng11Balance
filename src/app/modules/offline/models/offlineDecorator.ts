import { OfflineDbService } from '../services/offline-db.service';
import { OfflineManagerService } from '../services/offline-manager.service'
import { OfflineItemModelInterface } from './offlineItemModelInterface'
import { OfflineItemServiceInterface } from './offlineItemServiceInterface'

type Constructor<T = {}> = new (...args: any[]) => T;
export  function Offline<OfflineItemServiceInterface extends Constructor>(constr:OfflineItemServiceInterface){

   
  
   console.log("-- decorator function invoked --");
   return class extends constr{
       constructor(...args:any[]){
         super(...args)
         console.log('decorated')
         console.log('entityLabel',constr['entityLabel'])
         console.log('publish',constr['publish'])
         const db = new OfflineDbService()
         db.get(`${constr['entityLabel']}_status_db`).then(value=>{
            if(value==1){
               console.log('load from local db')
                db.fetchAllRawItems4Entity(constr['entityLabel']).then(items=>{
                   console.log('decorator got',constr['initializeItems'](items))
                   constr['publish'](constr['initializeItems'](items))
                })
            }
         })
      }
      
   }
}
     