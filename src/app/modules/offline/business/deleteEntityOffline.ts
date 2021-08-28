import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { OfflineManagerService } from "../services/offline-manager.service";

export class DeleteEntityOffline {
    key:string
    db: OfflineDbService
    dummyEntity:OfflineItemModelInterface
    constructor(key:string, db: OfflineDbService,dummyEntity:OfflineItemModelInterface) {
        this.db = db
        this.key= key
        this.dummyEntity= dummyEntity
    }

    async execute(isOnline: boolean) {
        await this.db.remove(this.key)
        if (isOnline) {// se online non serve registrare la modifica sul db locale
            const Item2Update = new Items2Update(this.entity, OperationKey.delete)
          //  new ChangesService().createItem(Item2Update)
        }
        else {
            // registro la modifica che sarà riportata onLine appena possibile
            await this.db.set(new Date().getTime() + '', { entityLabel: 'update', operation: OperationKey.delete, 'Key':this.key,'table':this.dummyEntity.entityLabel})
        }
        OfflineManagerService.publishEntity(this.entity.entityLabel)
    }entity: OfflineItemModelInterface
}