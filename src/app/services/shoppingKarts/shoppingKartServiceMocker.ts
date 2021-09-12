import { ShoppingKartModel } from "src/app/models/shoppingKartModel";
import { OfflineItemModelInterface } from "src/app/modules/offline/models/offlineItemModelInterface";
import { ChangesService } from "src/app/modules/offline/services/changes.service";
import { OfflineDbService } from "src/app/modules/offline/services/offline-db.service";
import { OfflineManagerService } from "src/app/modules/offline/services/offline-manager.service";
import { CategoriesService } from "../categories/categorie.service";
import { PaymentsService } from "../payments/payments.service";
import { SuppliersService } from "../suppliers/suppliers.service";
import { ShoppingKartsService } from "./shopping-karts.service";

export class ShoppingKartServiceMocker extends ShoppingKartsService {
    constructor(
        localDb: OfflineDbService,
        manager: OfflineManagerService,
        changes: ChangesService,
        categories: CategoriesService,
        payments: PaymentsService,
        suppliers: SuppliersService
    ) {
        super(categories, payments, suppliers, localDb, manager, changes)
    }

    db = {}

    async createItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item
        return new ShoppingKartModel().initialize(item)

    }

    async updateItem(item: OfflineItemModelInterface) {
        this.db[item.key] = item

    }

    async deleteItem(key: string) {
        delete this.db[key]
    }
}