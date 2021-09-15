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
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis mod"
        })
        const items = [
            new RawItem({ key: cat.key, item: { ...cat.serialize(), owner: 'me', operation: OperationKey.create,entity:'Categoria', date: new DateModel(new Date()).formatFullDate() } }),
            new RawItem({ key: catmod.key, item: { ...catmod.serialize(), owner: 'me', operation: OperationKey.update,entity:'Categoria', date: new DateModel(new Date()).formatFullDate() } })

        ]

        puller.entitiesRestore(items)

        expect(puller.changes.length).toEqual(2)
        expect(puller.changes[0].item).toBeInstanceOf(CategoryModel)
        expect(puller.changes[0].isSignedBy('me')).toBeTrue()
    })
})