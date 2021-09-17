import { threadId } from "worker_threads";
import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";

export class offlineCrudOperation{
    changes: ChangesService
    signature: string
    item: OfflineItemModelInterface
    localDb: OfflineDbService
    userOfflineEnabled= false
    constructor(changes:ChangesService,localDb:OfflineDbService,item:OfflineItemModelInterface,userOfflineEnabled:boolean,signature:string){
        this.changes= changes
        this.localDb= localDb
        this.item = item
        this.signature = signature
        this.userOfflineEnabled= userOfflineEnabled
        
    }

    async applyOnLocalDb(){
        if(this.userOfflineEnabled){
       await this.localDb.set(this.item.key,this.item.serialize4OfflineDb())}
        return this
    }

   async  createsChange(){
       const change = new Items2Update(this.signature,this.item,OperationKey.create)
       await this.changes.createItem(change)
       return this
   }

   async runOperations(){
     (await this.applyOnLocalDb()).createsChange()
       return this.item
   }

}