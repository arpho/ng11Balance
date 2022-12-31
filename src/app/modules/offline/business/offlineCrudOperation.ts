import { threadId } from "worker_threads";
import { Items2BeSynced } from "../models/items2BeSynced";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";

export class offlineCrudOperation {
    changes: ChangesService
    signature: string
    item: OfflineItemModelInterface
    localDb: OfflineDbService
    service: OfflineItemServiceInterface
    userOfflineEnabled = false
    constructor(changes: ChangesService, localDb: OfflineDbService, item: OfflineItemModelInterface, userOfflineEnabled: boolean, signature: string, service: OfflineItemServiceInterface) {
        this.changes = changes
        this.localDb = localDb
        this.item = item
        this.signature = signature
        this.userOfflineEnabled = userOfflineEnabled,
            this.service = service

    }

    async applyOnLocalDb() {
        if (this.userOfflineEnabled) {
            await this.localDb.set(this.item.key, this.item.serialize4OfflineDb())
        }
        return this
    }

    publishItems(items) {
        this.service.publish(items)
    }

    async createsChange() {
        console.log("creating change on local db for ", this.signature)
        const change = new Items2BeSynced(this.signature, this.item.serialize(), OperationKey.create)
        await this.changes.createItem(change)
        change.owner = this.signature
        console.log("created change", change)
        return this
    }

    async runOperations() {


        (await this.applyOnLocalDb()).createsChange()
        return this.item
    }

}