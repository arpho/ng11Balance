import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { DeleteEntityOffline } from "./deleteEntityOffline";
import { offlineCrudOperation } from "./offlineCrudOperation";

export class OfflineDeleteOperation extends offlineCrudOperation {
    item: OfflineItemModelInterface
    signature: string
    item2Update: Items2Update
    localDb: OfflineDbService;
    changes: ChangesService
    constructor(signature: string, item: OfflineItemModelInterface, localDb: OfflineDbService, changes: ChangesService,userOfflineEnabled:boolean) {
     super(changes,localDb,item,userOfflineEnabled,signature)
    }
    async applyOnLocalDb(){
        await this.localDb.remove(this.item.key)
        return this
    }

    async createsChange(){
    const change = new Items2Update(this.signature,this.item,OperationKey.delete)
    await this.changes.createItem(change)
        return this
    }
}