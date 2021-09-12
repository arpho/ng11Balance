import { SupplierModel } from "src/app/models/supplierModel";
import { OfflineItemModelInterface } from "src/app/modules/offline/models/offlineItemModelInterface";
import { ChangesService } from "src/app/modules/offline/services/changes.service";
import { OfflineDbService } from "src/app/modules/offline/services/offline-db.service";
import { OfflineManagerService } from "src/app/modules/offline/services/offline-manager.service";
import { SuppliersService } from "./suppliers.service";

export class SuppliersServiceMocker extends SuppliersService{
    constructor(localDb:OfflineDbService,manager:OfflineManagerService,changes:ChangesService){
        super(localDb,manager,changes)
    }

    db = {}

    async createItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item
        return new SupplierModel().initialize(item)

    }

    async updateItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item

    }

    async deleteItem(key: string) {
        delete this.db[key]
    }
}