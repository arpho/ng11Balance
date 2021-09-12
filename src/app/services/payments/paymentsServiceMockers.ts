import { PaymentsModel } from "src/app/models/paymentModel";
import { OfflineItemModelInterface } from "src/app/modules/offline/models/offlineItemModelInterface";
import { ChangesService } from "src/app/modules/offline/services/changes.service";
import { OfflineDbService } from "src/app/modules/offline/services/offline-db.service";
import { OfflineManagerService } from "src/app/modules/offline/services/offline-manager.service";
import { PaymentsService } from "./payments.service";

export class paymentsServiceMocker extends PaymentsService {
    constructor(manager: OfflineManagerService, localDb: OfflineDbService, changes: ChangesService) {
        super(localDb, manager, changes)
    }

    db = {}

    async createItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item
        return new PaymentsModel().initialize(item)

    }

    async updateItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item

    }

    async deleteItem(key: string) {
        delete this.db[key]
    }
}