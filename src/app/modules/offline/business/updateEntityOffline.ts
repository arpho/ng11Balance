import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OperationKey } from "../models/operationKey";
import { OfflineDbService } from "../services/offline-db.service";
import { OfflineManagerService } from "../services/offline-manager.service";

export class UpdateEntityOffline {
    entity: OfflineItemModelInterface
    db: OfflineDbService
    constructor(entity: OfflineItemModelInterface, db: OfflineDbService) {
        this.db = db
        this.entity = entity
    }

    async execute(isOnline: boolean) {
        await this.db.set(this.entity.key, { ...this.entity.serialize4OfflineDb() })
        if (isOnline) {// se online non serve registrare la modifica sul db locale

        }
        else {
            // registro la modifica che sarà riportata onLine appena possibile
            await this.db.set(new Date().getTime() + '', { entityLabel: 'update',operation:OperationKey.update, 'entity': this.entity.serialize4OfflineDb() })
        }
        OfflineManagerService.publishEntity(this.entity.entityLabel)
    }
}