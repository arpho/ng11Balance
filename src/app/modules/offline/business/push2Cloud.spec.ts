import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
import { CategoriesServiceMocker } from "src/app/services/categories/categoriesServiceMocker"
import { UsersService } from "../../user/services/users.service"
import { OperationKey } from "../models/operationKey"
import { ChangesService } from "../services/changes.service"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { OfflineManagerService } from "../services/offline-manager.service"
import { Push2Cloud } from "./push2Cloud"
var db: LocalForageMocker
var changes: ChangesService
var users:UsersService
var manager
describe('push changes to the cloud', () => {
    beforeEach(waitForAsync(() => {
        db = new LocalForageMocker()
        changes = new ChangesService()
        users = new UsersService()
        manager = new OfflineManagerService(db, users,changes)
    }))

    it('category created offline', async () => {
        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        const key = new Date().getTime() + ''
        await db.set(key, { entityLabel: 'update', operation: OperationKey.create, 'entity': cat.serialize4OfflineDb() }) //insert the offline update to be synchronized
        const servicesList = [new CategoriesServiceMocker(new OfflineManagerService(db, users,changes), db,changes, users)]
        const pusher = new Push2Cloud(db, servicesList)
        await pusher.execute()
        // the created cat must be removed
        const removed = await db.db[key]
        expect(removed).toBeUndefined()

    })
})