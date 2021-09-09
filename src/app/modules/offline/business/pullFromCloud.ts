import { Items2Update } from "../models/items2Update";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";

export class pullChangesFromCloud {
    changes: ChangesService
    localDb: OfflineDbService
    constructor(changes: ChangesService, localDb: OfflineDbService) {
        this.localDb = localDb
        this.changes = changes
    }
    execute(changes:Items2Update[]){
        
    }
}