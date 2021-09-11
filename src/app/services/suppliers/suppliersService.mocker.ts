import { ChangesService } from "src/app/modules/offline/services/changes.service";
import { OfflineDbService } from "src/app/modules/offline/services/offline-db.service";
import { OfflineManagerService } from "src/app/modules/offline/services/offline-manager.service";
import { SuppliersService } from "./suppliers.service";

export class SuppliersServiceMocker extends SuppliersService{
    constructor(localDb:OfflineDbService,manager:OfflineManagerService,changes:ChangesService){
        super(localDb,manager,changes)
    }
}