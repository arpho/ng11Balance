import { Items2Update } from "../models/items2Update"
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface"
import { OperationKey } from "../models/operationKey"
import { ChangesService } from "../services/changes.service"
import { OfflineDbService } from "../services/offline-db.service"
import { CreateEntityOffline } from "./createEntityOffline"
import { offlineCrudOperation } from "./offlineCrudOperation"

export class OfflineCreateOperation extends offlineCrudOperation {
    signature: string
    item: OfflineItemModelInterface
    item2Update: Items2Update
    localDb: OfflineDbService
    changes: ChangesService
    constructor(item: OfflineItemModelInterface, changes: ChangesService, signature: string, localDb: OfflineDbService, userOfflineEnabled: boolean) {
        super(changes, localDb, item, userOfflineEnabled, signature)
        if (userOfflineEnabled) {
            this.item.key = `${this.item.entityLabel}_${new Date().getTime()}`
        }
    }


    async applyOnLocalDb() {
        this.localDb.set(this.item.key, this.item)
        return this
    }

    /**createsChange not implemented because super.createsChanges do what is needed */


}