import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { DeleteEntityOffline } from "./deleteEntityOffline";
import { offlineCrudOperation } from "./offlineCrudOperation";

export class OfflineDeleteOperation implements offlineCrudOperation {
    item: OfflineItemModelInterface
    signature: string
    item2Update: Items2Update
    localDb: OfflineDbService;
    changes: ChangesService
    constructor(signature: string, item: ItemModelInterface, localDb: OfflineDbService, changes: ChangesService) {
        this.changes = changes
        this.localDb = localDb
        this.item2Update = new Items2Update(signature, this.item, OperationKey.delete)
    }
    async execute() {
        await new DeleteEntityOffline(this.item.key, this.localDb, this.item.entityLabel, this.signature).execute(navigator.onLine)

        await this.changes.createItem(this.item2Update)
    }
}