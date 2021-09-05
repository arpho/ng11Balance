import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { offlineCrudOperation } from "./offlineCrudOperation";
import { UpdateEntityOffline } from "./updateEntityOffline";

export class OfflineUpdateOperation implements offlineCrudOperation{
    changes: ChangesService
    signature: string
    item: OfflineItemModelInterface
    item2Update: Items2Update
    localDb: OfflineDbService
    constructor(item: OfflineItemModelInterface,  changes: ChangesService, localDb: OfflineDbService) {
        this.changes = changes
        this.signature = this.signature
        this.localDb = localDb
        this.item = item
        this.item2Update = new Items2Update(this.signature, this.item, OperationKey.update)

    }

    async execute() {
        await new UpdateEntityOffline(this.item, this.localDb, this.signature).execute(navigator.onLine)

        await this.changes.createItem(this.item2Update)
    }
}