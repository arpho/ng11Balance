//import { service } from "firebase-functions/v1/analytics"
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable"
import { first } from "rxjs/operators"
import { Items2Update } from "../models/items2Update"
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface"
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface"
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
    constructor(item: OfflineItemModelInterface, changes: ChangesService, signature: string, localDb: OfflineDbService, userOfflineEnabled: boolean,service:OfflineItemServiceInterface) {
        super(changes, localDb, item, userOfflineEnabled, signature,service)
        if (userOfflineEnabled) {
            this.item.key = `${this.item.entityLabel}_${new Date().getTime()}`
        }
    }


    async applyOnLocalDb() {
        this.localDb.set(this.item.key, this.item)
        this.service.items.pipe(first()).subscribe(items=>{
            const newitems = [...items,this.item]
            this.publishItems(newitems)
        })
        return this
    }

    /**createsChange not implemented because super.createsChanges do what is needed */


}