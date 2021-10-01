import { first } from "rxjs/operators";
import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { offlineCrudOperation } from "./offlineCrudOperation";
import { UpdateEntityOffline } from "./updateEntityOffline";

export class OfflineUpdateOperation extends offlineCrudOperation{
    changes: ChangesService
    signature: string
    item: OfflineItemModelInterface
    item2Update: Items2Update
    localDb: OfflineDbService
    constructor(item: OfflineItemModelInterface,  changes: ChangesService, localDb: OfflineDbService,signature:string,userOfflineEnabled,service:OfflineItemServiceInterface) {
      super(changes,localDb,item,userOfflineEnabled,signature,service)

    }

   async applyOnLocalDb(){
       this.localDb.set(this.item.key,this.item.serialize4OfflineDb())
       this.service.items.pipe(first()).subscribe(items=>{
           const updatedList = items.map(item=> (item.key==this.item.key)? this.item: item)
           this.service.publish(updatedList)

       })
       return this
   }

   async createsChange(){
       const change = new Items2Update(this.signature,this.item,OperationKey.update)
       await this.changes.createItem(change)
       return this 
   }
}