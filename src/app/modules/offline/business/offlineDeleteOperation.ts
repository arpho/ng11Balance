import { first } from "rxjs/operators";
import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { Items2BeSynced } from "../models/items2BeSynced";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { DeleteEntityOffline } from "./deleteEntityOffline";
import { offlineCrudOperation } from "./offlineCrudOperation";

export class OfflineDeleteOperation extends offlineCrudOperation {
    item: OfflineItemModelInterface
    signature: string
    item2Update: Items2BeSynced
    localDb: OfflineDbService;
    changes: ChangesService
    constructor(signature: string, item: OfflineItemModelInterface, localDb: OfflineDbService, changes: ChangesService, userOfflineEnabled: boolean, service: OfflineItemServiceInterface) {
        super(changes, localDb, item, userOfflineEnabled, signature, service)
    }
    async applyOnLocalDb() {
        await this.localDb.remove(this.item.key)
        this.service.items.pipe(first()).subscribe(items => {
            const filteredList = items.filter(item => item.key != this.item.key)
            this.service.publish(filteredList)
        })
        return this
    }

    async createsChange() {
        const change = new Items2BeSynced(this.signature, this.item, OperationKey.delete)
        await this.changes.createItem(change)
        return this
    }
}