import { Items2Update } from "../models/items2Update";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";

export class pullChangesFromCloud {
    changes: ChangesService
    localDb: OfflineDbService
    constructor(changes: ChangesService, localDb: OfflineDbService) {
        this.localDb = localDb
        this.changes = changes
    }
    async execute(changes: Items2Update[], signature: string) {
        changes.forEach(async change => {

            if (change.operationKey == OperationKey.create)
                await this.localDb.set(change.item['key'], change.item['serialize4OfflineDb']())
            if (change.operationKey == OperationKey.update) {
                await this.localDb.set(change.item['key'], change.item['serialize4OfflineDb']())
            }
            if (change.operationKey == OperationKey.delete) {
                await this.localDb.remove(change.item['key'])
            }

            change.sign(signature)
            await this.changes.updateItem(change)

        })

    }
}