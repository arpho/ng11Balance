import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
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
    constructor(item: OfflineItemModelInterface,  changes: ChangesService, localDb: OfflineDbService,signature:string,userOfflineEnabled) {
      super(changes,localDb,item,userOfflineEnabled,signature)

    }

   async applyOnLocalDb(){
       this.localDb.set(this.item.key,this.item.serialize4OfflineDb())
       return this
   }

   async createsChange(){
       const change = new Items2Update(this.signature,this.item,OperationKey.update)
       await this.changes.createItem(change)
       return this 
   }
}