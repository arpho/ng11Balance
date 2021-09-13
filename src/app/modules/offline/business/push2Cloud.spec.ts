import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
import { CategoriesServiceMocker } from "src/app/services/categories/categoriesServiceMocker"
import { UsersService } from "../../user/services/users.service"
import { OperationKey } from "../models/operationKey"
import { ChangesService } from "../services/changes.service"
import { ConnectionStatusService } from "../services/connection-status.service"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { OfflineManagerService } from "../services/offline-manager.service"
import { Push2Cloud } from "./push2Cloud"
var db: LocalForageMocker
var changes: ChangesService
var users:UsersService
var manager,connection
describe('push changes to the cloud', () => {
    beforeEach(waitForAsync(() => {
        db = new LocalForageMocker()
        changes = new ChangesService()
        users = new UsersService()
        connection = new ConnectionStatusService()
        manager = new OfflineManagerService(db, users,changes,connection)
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
        const servicesList = [new CategoriesServiceMocker(new OfflineManagerService(db, users,changes,connection), db,changes)]
        const pusher = new Push2Cloud(db, servicesList)
        await pusher.execute()
        // the created cat must be removed
        const removed = await db.db[key]
        expect(removed).toBeUndefined()
        const createdCat = await servicesList[0].db[cat.key]
        expect(createdCat['title']).toEqual(cat.title)
        expect(createdCat['fatherKey']).toEqual(cat.fatherKey)

    })

    it('category updated offline',async ()=>{

        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        const categories = new CategoriesServiceMocker(new OfflineManagerService(db, users,changes,connection), db,changes)
        categories.createItem(cat)
        const servicesList = [categories]
        const pusher = new Push2Cloud(db,servicesList)
        const key = new Date().getTime() + ''

        const updatedCat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZa",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis mod"
        })
        await db.set(key, { entityLabel: 'update', operation: OperationKey.update, 'entity': updatedCat.serialize4OfflineDb() }) //insert the offline update to be synchronized
        await pusher.execute()

        const cloudUpdatedCat = await servicesList[0].db[cat.key]
        expect(cloudUpdatedCat['title']).toEqual(updatedCat.title)
        expect(cloudUpdatedCat['fatherKey']).toEqual(updatedCat.fatherKey)
        const removed = await db.db[key]
        expect(removed).toBeUndefined()

    })
    it('category deleted offline',async ()=>{
        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        const categories = new CategoriesServiceMocker(new OfflineManagerService(db, users,changes,connection), db,changes)
        categories.createItem(cat)
        const servicesList = [categories]
        const pusher = new Push2Cloud(db,servicesList)
        const key = new Date().getTime() + ''
        await db.set(key, { entityLabel: 'update', operation: OperationKey.delete, 'entity': new CategoryModel().setKey(cat.key).serialize4OfflineDb() }) //insert the offline update to be synchronized
        categories.createItem(cat)
        await pusher.execute()
        expect(categories.db[cat.key]).toBeUndefined()
        const removed = await db.db[key]
        expect(removed).toBeUndefined()

    })
})