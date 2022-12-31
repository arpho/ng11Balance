import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { Items2BeSynced } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { OfflineManagerService } from "../services/offline-manager.service";

export class UpdateEntityOffline {
    entity: OfflineItemModelInterface
    db: OfflineDbService
    constructor(entity: OfflineItemModelInterface, db: OfflineDbService,public owner) {
        this.db = db
        this.entity = entity
    }

    async execute(isOnline: boolean) {
        await this.db.set(this.entity.key, { ...this.entity.serialize4OfflineDb() })
        if (isOnline) {// se online non serve registrare la modifica sul db locale
            const Item2Update = new Items2BeSynced(this.owner,this.entity, OperationKey.update)
           new  ChangesService().createItem(Item2Update)
        }
        else {
            // registro la modifica che sarà riportata onLine appena possibile
            await this.db.set(new Date().getTime() + '', { entityLabel: 'update', operation: OperationKey.update, 'entity': this.entity.serialize4OfflineDb() })
        }
        OfflineManagerService.publishEntity(this.entity.entityLabel)
    }
}