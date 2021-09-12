import { OfflineItemModelInterface } from "src/app/modules/offline/models/offlineItemModelInterface";
import { ChangesService } from "src/app/modules/offline/services/changes.service";
import { OfflineDbService } from "src/app/modules/offline/services/offline-db.service";
import { OfflineManagerService } from "src/app/modules/offline/services/offline-manager.service";
import { UsersService } from "src/app/modules/user/services/users.service";
import { CategoriesService } from "./categorie.service";

export class CategoriesServiceMocker extends CategoriesService {
    constructor(manager: OfflineManagerService, localDb: OfflineDbService, changes: ChangesService, ) {
        super(manager,  localDb, changes)
    }

    db = {}

    async createItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item

    }

    async updateItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item

    }

    async deleteItem(key: string) {
        delete this.db[key]
    }


}