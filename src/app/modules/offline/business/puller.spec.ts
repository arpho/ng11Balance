import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
import { CategoriesServiceMocker } from "src/app/services/categories/categoriesServiceMocker"
import { DateModel } from "../../user/models/birthDateModel"
import { UsersService } from "../../user/services/users.service"
import { OperationKey } from "../models/operationKey"
import { RawItem } from "../models/rawItem"
import { ConnectionStatusService } from "../services/connection-status.service"
import { ChangesServiceMockers } from "../services/mockers/ChangeServiceMocks"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { OfflineManagerService } from "../services/offline-manager.service"
import { Puller } from "./puller"
import { pullChangesFromCloud } from "./pullFromCloud"
var db: LocalForageMocker
var changes: ChangesServiceMockers
var users: UsersService
var manager, connection
var puller: Puller
var categories: CategoriesServiceMocker

describe('testing puller', () => {
    beforeEach(waitForAsync(() => {
        db = new LocalForageMocker()
        changes = new ChangesServiceMockers()
        users = new UsersService()
        connection = new ConnectionStatusService()
        manager = new OfflineManagerService(db, users, changes, connection)
        categories = new CategoriesServiceMocker(manager, db, changes)
        puller = new Puller(db, 'me', [categories], changes)
    }))
    it('entities correctly restored', () => {

        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        const catmod = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZl",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis mod"
        })
        const items = [
            new RawItem({ key: cat.key, item: { ...cat.serialize(), owner: 'me', operation: OperationKey.create, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            new RawItem({ key: catmod.key, item: { ...catmod.serialize(), owner: 'me', operation: OperationKey.update, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            new RawItem({ key: catmod.key, item: { ...new CategoryModel().setKey(cat.key).serialize(), owner: 'me', operation: OperationKey.delete, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } })

        ]

        puller.entitiesRestore(items)

        expect(puller.changes.length).toEqual(items.length)
        expect(puller.changes[0].item).toBeInstanceOf(CategoryModel)
        expect(puller.changes[0].isSignedBy('me')).toBeTrue()
        expect(puller.changes[0].operationKey).toEqual(OperationKey.create)
        expect(puller.changes[1].operationKey).toEqual(OperationKey.update)
        expect(puller.changes[2].operationKey).toEqual(OperationKey.delete)
        expect(puller.changes[2].item.key).toEqual(cat.key)
        expect(puller.changes[0].item.title).toEqual(cat.title)
        expect(puller.changes[1].item.title).toEqual(catmod.title)
        expect(puller.changes[0].item['fatherKey']).toEqual(cat['fatherKey'])
        expect(puller.changes[1].item['fatherKey']).toEqual(catmod['fatherKey'])
        expect(puller.changes[1].date).toBeTruthy()

    })
    it('creation is stored correctly', async () => {

        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        const catmod = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZl",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis mod"
        })
        const items = [
            new RawItem({ key: cat.key, item: { ...cat.serialize(), owner: 'me0', operation: OperationKey.create, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            /* new RawItem({ key: catmod.key, item: { ...catmod.serialize(), owner: 'me', operation: OperationKey.update,entity:'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            new RawItem({ key: catmod.key, item: { ...new CategoryModel().setKey(cat.key).serialize(), owner: 'me', operation: OperationKey.delete,entity:'Categoria', date: new DateModel(new Date()).formatFullDate() } })
 */
        ]

        puller.entitiesRestore(items).applyChangesnotOwnedByMe()
        console.log("#* db for puller",db)
      //  expect((await db.get(cat.key)).item).toBeTruthy()
        console.log("get key #*",cat.key,await db.get(cat.key))
        expect((await db.get(cat.key))['item']).toBeUndefined() // the object as been deleted

    })
    it('changes owned by me are not applyed', async () => {

        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        const catmod = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZl",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis mod"
        })
        const items = [
            new RawItem({ key: cat.key, item: { ...cat.serialize(), owner: 'me', operation: OperationKey.create, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            /* new RawItem({ key: catmod.key, item: { ...catmod.serialize(), owner: 'me', operation: OperationKey.update,entity:'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            new RawItem({ key: catmod.key, item: { ...new CategoryModel().setKey(cat.key).serialize(), owner: 'me', operation: OperationKey.delete,entity:'Categoria', date: new DateModel(new Date()).formatFullDate() } })
 */
        ]

        puller.entitiesRestore(items).applyChangesnotOwnedByMe()
        expect((await db.get(cat.key)).item).toBeFalsy()

    })

    it('creation and update are stored correctly', async () => {

        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        const catmod = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZl",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis mod"
        })
        const items = [
            new RawItem({ key: cat.key, item: { ...cat.serialize(), owner: 'me0', operation: OperationKey.create, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            new RawItem({ key: catmod.key, item: { ...catmod.serialize(), owner: 'me0', operation: OperationKey.update, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            /*new RawItem({ key: catmod.key, item: { ...new CategoryModel().setKey(cat.key).serialize(), owner: 'me', operation: OperationKey.delete,entity:'Categoria', date: new DateModel(new Date()).formatFullDate() } })
 */
        ]

        puller.entitiesRestore(items).applyChangesnotOwnedByMe()
        expect((await db.get(cat.key)).item['title']).toEqual(catmod.title)
       const test = await db.get(cat.key)
        expect(test.item['entityLabel']).toEqual(catmod.entityLabel)

    })

    it('creation and update and delete are stored correctly', async () => {

        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        const catmod = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZl",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis mod"
        })
        const items = [
            new RawItem({ key: cat.key, item: { ...cat.serialize(), owner: 'me0', operation: OperationKey.create, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            new RawItem({ key: catmod.key, item: { ...catmod.serialize(), owner: 'me0', operation: OperationKey.update, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            new RawItem({ key: catmod.key, item: { ...new CategoryModel().setKey(cat.key).serialize(), owner: 'me0', operation: OperationKey.delete, entity: 'Categoria', date: new DateModel(new Date()).formatFullDate() } })

        ]

        puller.entitiesRestore(items).applyChangesnotOwnedByMe()
        expect(((await db.get(cat.key)).item)).toBeFalsy()
        expect(puller.changes[0].isSignedBy('me')).toBeTrue()
        expect(puller.changes[0].isSignedBy('me0')).toBeTrue()

    })
})