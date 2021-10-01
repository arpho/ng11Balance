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
import { OfflineUpdateOperation } from "./offlineUpdateOperation"

var Changes: ChangesServiceMockers
var db: LocalForageMocker
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

it('item should be properly created', async () => {
    Changes = new ChangesServiceMockers()



    creatOP = new OfflineUpdateOperation(categoryTest, Changes, db, 'test', true, Categories)
    creatOP.runOperations()
    const item = await db.get(categoryTest.key)
    expect(item.item).toBeTruthy()
    expect(item.item['entityLabel']).toEqual(categoryTest.entityLabel)
    expect(item.item['title']).toEqual(categoryTest.title)

})

it('changes should be created properly', async () => {
    Changes = new ChangesServiceMockers()
    db = new LocalForageMocker()
    const users = new UsersService()
    const manager = new OfflineManagerService(db, users, Changes, new ConnectionStatusService())
    const Categories = new CategoriesServiceMocker(manager, db, Changes)


    creatOP = new OfflineUpdateOperation(categoryTest, Changes, db, 'test', true, Categories)
    categoryTest = new CategoryModel().initialize({
        entityLabel: "Categoria",
        fatherKey: "-LMTmZbBd6roqklYDflZ",
        key: "-Ks0UdZGtzunNoCmGGJd",
        title: "gnosis"
    })
    await db.set(categoryTest.key, categoryTest.serialize4OfflineDb())
    const catmod = categoryTest = new CategoryModel().initialize({
        entityLabel: "Categoria",
        fatherKey: "-LMTmZbBd6roqklYDflZ",
        key: "-Ks0UdZGtzunNoCmGGJd",
        title: "gnosis"
    })
    creatOP = new OfflineUpdateOperation(catmod, Changes, db, 'test', true, Categories)
    await creatOP.runOperations()
    expect(Changes.changesList.length).toEqual(1)
    expect(Changes.changesList[0].operationKey).toEqual(OperationKey.update)
    expect(Changes.changesList[0].isSignedBy('test0')).toBeFalse()
    expect(Changes.changesList[0].item).toBeInstanceOf(CategoryModel)
    expect(Changes.changesList[0].item.title).toEqual(categoryTest.title)
    expect(await (await db.get(catmod.key)).item).toBeTruthy()
    expect(await (await db.get(catmod.key)).item['title']).toEqual(catmod.title)
})