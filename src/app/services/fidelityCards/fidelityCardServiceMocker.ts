import { FidelityCardModel } from "src/app/models/fidelityCardModel";
import { OfflineItemModelInterface } from "src/app/modules/offline/models/offlineItemModelInterface";
import { ChangesService } from "src/app/modules/offline/services/changes.service";
import { OfflineDbService } from "src/app/modules/offline/services/offline-db.service";
import { OfflineManagerService } from "src/app/modules/offline/services/offline-manager.service";
import { FidelityCardService } from "./fidelity-card.service";

export class FidelityCardServiceMocker extends FidelityCardService {
    constructor(manager: OfflineManagerService, changes: ChangesService, localDb: OfflineDbService) {
        super(localDb, manager, changes)
    }

    db = {}

    async createItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item
        return new FidelityCardModel().initialize(item)
    }

    async updateItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item

    }

    async deleteItem(key: string) {
        delete this.db[key]
    }
}