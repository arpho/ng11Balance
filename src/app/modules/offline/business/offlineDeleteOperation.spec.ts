import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
import { CategoriesServiceMocker } from "src/app/services/categories/categoriesServiceMocker"
import { UsersService } from "../../user/services/users.service"
import { OperationKey } from "../models/operationKey"
import { ConnectionStatusService } from "../services/connection-status.service"
import { ChangesServiceMockers } from "../services/mockers/ChangeServiceMocks"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { OfflineManagerService } from "../services/offline-manager.service"
import { OfflineCreateOperation } from "./offlineCreateOperation"
import { OfflineDeleteOperation } from "./offlineDeleteOperation"
import { OfflineUpdateOperation } from "./offlineUpdateOperation"

var Changes: ChangesServiceMockers
var db: LocalForageMocker
var creatOP: OfflineCreateOperation
var users: UsersService
var manager: OfflineManagerService
var Categories: CategoriesServiceMocker
var creatOP: OfflineCreateOperation
var categoryTest = new CategoryModel().initialize({
    entityLabel: "Categoria",
    fatherKey: "-LMTmZbBd6roqklYDflZ",
    key: "-Ks0UdZGtzunNoCmGGJd",
    title: "gnosis"
})
describe('create operation works', () => {
    beforeEach(waitForAsync(() => {

        db = new LocalForageMocker()
        users = new UsersService()
        manager = new OfflineManagerService(db, users, Changes, new ConnectionStatusService())
        Categories = new CategoriesServiceMocker(manager, db, Changes)
    }))
})

it('changes should be created properly', async () => {
    Changes = new ChangesServiceMockers()
    db = new LocalForageMocker()
    users = new UsersService()
    manager = new OfflineManagerService(db, users, Changes, new ConnectionStatusService())
    Categories = new CategoriesServiceMocker(manager, db, Changes)
    const cat = categoryTest = new CategoryModel().initialize({
        entityLabel: "Categoria",
        fatherKey: "-LMTmZbBd6roqklYDflZ",
        key: "-Ks0UdZGtzunNoCmGGJd",
        title: "gnosis"
    })
    db.set(cat.key, cat.serialize4OfflineDb())
    const dummy = new CategoryModel().setKey(cat.key)
    const deleteOp = new OfflineDeleteOperation('test', dummy, db, Changes, true, Categories)

    await deleteOp.runOperations()
    expect(Changes.changesList.length).toEqual(1)
    expect(Changes.changesList[0].operationKey).toEqual(OperationKey.delete)
    expect(Changes.changesList[0].isSignedBy('test0')).toBeFalse()
    expect(Changes.changesList[0].isSignedBy('test')).toBeTruthy()
    expect(Changes.changesList[0].item).toBeInstanceOf(CategoryModel)
    expect(Changes.changesList[0].item.title).toBeFalsy()
    expect((await db.get(cat.key)).item).toBeFalsy()
})