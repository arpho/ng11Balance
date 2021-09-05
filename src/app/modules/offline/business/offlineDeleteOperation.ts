import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OperationKey } from "../models/operationKey";
import { OfflineDbService } from "../services/offline-db.service";
import { DeleteEntityOffline } from "./deleteEntityOffline";

export class OfflineDeleteOperation{
    item:OfflineItemModelInterface
    signature:string
    item2Update:Items2Update
    localDb: OfflineDbService;
    constructor(signature:string,item:ItemModelInterface,localDb:OfflineDbService){
        this.localDb = localDb
        this.item2Update = new Items2Update(signature, this.item, OperationKey.delete)
    }
    async execute(){
        await new DeleteEntityOffline(this.item.key, this.localDb, this.item.entityLabel, this.signature).execute(navigator.onLine)
    }
}