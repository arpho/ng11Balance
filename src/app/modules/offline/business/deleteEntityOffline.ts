import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { Items2BeSynced } from "../models/items2BeSynced";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { OfflineManagerService } from "../services/offline-manager.service";

export class DeleteEntityOffline {
    key: string
    db: OfflineDbService
    entityLabel: string
    constructor(key: string, db: OfflineDbService, entityLabel,public owner) {
        this.db = db
        this.key = key
        this.entityLabel = entityLabel
    }

    async execute(isOnline: boolean) {
        await this.db.remove(this.key)
        if (isOnline) {// se online non serve registrare la modifica sul db locale
            const Item2Update = new Items2BeSynced(this.owner,null, OperationKey.delete)
            //  new ChangesService().createItem(Item2Update)
        }
        else {
            // registro la modifica che sarà riportata onLine appena possibile
            await this.db.set(new Date().getTime() + '', { entityLabel: 'update', operation: OperationKey.delete, 'itemKey': this.key, 'table': this?.entityLabel })
        }
        OfflineManagerService.publishEntity(this.entityLabel)
    } entity: OfflineItemModelInterface
}