import { Items2Update } from "../models/items2Update"
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface"
import { OperationKey } from "../models/operationKey"
import { ChangesService } from "../services/changes.service"
import { OfflineDbService } from "../services/offline-db.service"
import { CreateEntityOffline } from "./createEntityOffline"

export class OfflineCreateOperation{
    signature:string
    item:OfflineItemModelInterface
    item2Update:Items2Update
    localDb:OfflineDbService
    changes:ChangesService
    constructor(item:OfflineItemModelInterface,changes:ChangesService,signature:string,localDb:OfflineDbService) {
        this.signature= signature
        this.item= item
        this.localDb= localDb
        this.changes= changes
        this.item2Update =  new Items2Update(signature, this.item, OperationKey.create)
    }
    async execute(){

        await new CreateEntityOffline(this.item, this.localDb, this.signature).execute(navigator.onLine)

        await this.changes.createItem(this.item2Update)}
}