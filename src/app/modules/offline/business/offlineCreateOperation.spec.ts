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

var Changes: ChangesServiceMockers
var db: LocalForageMocker
var creatOP: OfflineCreateOperation
var users: UsersService
var manager: OfflineManagerService
var Categories: CategoriesServiceMocker
const categoryTest = new CategoryModel().initialize({
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
    db = new LocalForageMocker()
    users = new UsersService()
    manager = new OfflineManagerService(db, users, Changes, new ConnectionStatusService())
    Categories = new CategoriesServiceMocker(manager, db, Changes)
    creatOP = new OfflineCreateOperation(categoryTest, Changes, 'test', db, true, Categories)
    creatOP.runOperations()
    const item = await db.get(categoryTest.key)
    expect(item.item).toBeTruthy()
    expect(item.item['entityLabel']).toEqual(categoryTest.entityLabel)
    expect(item.item['title']).toEqual(categoryTest.title)
})

it('changes should be created properly', async () => {
    Changes = new ChangesServiceMockers()
    db = new LocalForageMocker()
    users = new UsersService()
    manager = new OfflineManagerService(db, users, Changes, new ConnectionStatusService())
    Categories = new CategoriesServiceMocker(manager, db, Changes)
    creatOP = new OfflineCreateOperation(categoryTest, Changes, 'test', db, true, Categories)
    await creatOP.runOperations()
    expect(Changes.changesList.length).toEqual(1)
    expect(Changes.changesList[0].operationKey).toEqual(OperationKey.create)
    expect(Changes.changesList[0].owner).toEqual('test')
    console.log("#* item",Changes.changesList[0].item.entityLabel)
    expect(Changes.changesList[0].item.entityLabel).toBe("Categoria")
    expect(Changes.changesList[0].item.title).toEqual(categoryTest.title)
})

it('item correctly created on local db', async () => {
    Changes = new ChangesServiceMockers()
    db = new LocalForageMocker()
    users = new UsersService()
    manager = new OfflineManagerService(db, users, Changes, new ConnectionStatusService())
    Categories = new CategoriesServiceMocker(manager, db, Changes)
    const categoryTest = new CategoryModel().initialize({
        entityLabel: "Categoria",
        fatherKey: "-LMTmZbBd6roqklYDflZ",
        key: "-Ks0UdZGtzunNoCmGGJd",
        title: "gnosis"
    })
    creatOP = new OfflineCreateOperation(categoryTest, Changes, 'test', db, true, Categories)
    await creatOP.runOperations()
    expect((await db.get("Ks0UdZGtzunNoCmGGJd")).item).toBeFalsy()
    expect((await db.get(categoryTest.key)).item['entityLabel']).toEqual(categoryTest.entityLabel)
    expect((await db.get(categoryTest.key)).item['fatherKey']).toEqual(categoryTest.fatherKey)
    expect((await db.get(categoryTest.key)).item['title']).toEqual(categoryTest.title)

})
