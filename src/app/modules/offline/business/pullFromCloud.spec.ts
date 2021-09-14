import { ChangesServiceMockers } from "../services/mockers/ChangeServiceMocks"
import { pullChangesFromCloud } from "./pullFromCloud"
import { LocalForageMocker } from '../services/mockers/offlineDbServiceMocker'
import { CategoryModel } from "src/app/models/CategoryModel"
import { Items2Update } from "../models/items2Update"
import { OperationKey } from "../models/operationKey"
import { waitForAsync } from "@angular/core/testing"
import { CategoriesService } from "src/app/services/categories/categorie.service"
import { OfflineManagerService } from "../services/offline-manager.service"
import { UsersService } from "../../user/services/users.service"
import { ConnectionStatusService } from "../services/connection-status.service"
import { RawItem } from "../models/rawItem"
import { CategoriesServiceMocker } from "src/app/services/categories/categoriesServiceMocker"
var db
describe('testing pull changes', () => {
    beforeEach(waitForAsync(() => { db = new LocalForageMocker() }))



    it('the new item should have been created on localDb', () => {
        const changesService = new ChangesServiceMockers()
        const pull = new pullChangesFromCloud(changesService, db,[])
        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        const change = new Items2Update('me', cat, OperationKey.create)
        const changes = [change]
        changesService.setChanges(changes)
        pull.execute(changes, 'test')
        db.get("Ks0UdZGtzunNoCmGGJd").then(item => {
            expect(db.db[cat.key]).toBeTruthy()
            expect(db.db[cat.key]['key']).toEqual(cat.key)
            expect(db.db[cat.key]['title']).toEqual(cat.title)
            expect(db.db[cat.key]['fatherKey']).toEqual(cat.fatherKey)
            expect(db.db[cat.key]['entityLabel']).toEqual(cat.entityLabel)
            expect(changesService.changesList[0].isSignedBy('me')).toBeTrue()
        })


    })

    it('updating an item', async () => {
        const changesService = new ChangesServiceMockers()
        const users = new UsersService()
        const manager = new OfflineManagerService(new LocalForageMocker(),users,changesService, new ConnectionStatusService())
        const Categories = new CategoriesService(manager,new LocalForageMocker(),changesService)
        const pull = new pullChangesFromCloud(changesService, db,[Categories])

        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        await db.set(cat.key, cat)
        const catUpdate = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis mod"
        })

        const change = new Items2Update('me', catUpdate, OperationKey.update)
        const changes = [change]
        changesService.setChanges(changes)
        await pull.execute(changes, 'test')
        pull.changes.subscribe(changes=>{console.log('got changes **',changes,changes.length)
        const  item = changes[0]?.item
        expect(changes.length).toEqual(1)
        expect(item['key']).toEqual(catUpdate.key)
        expect(item['title']).toEqual(catUpdate.title)
        expect(item['fatherKey']).toEqual(catUpdate.fatherKey)
        expect(item['entityLabel']).toEqual(catUpdate.entityLabel)
    
    })

        


    })

    it('deleting an item', async () => {
        const changesService = new ChangesServiceMockers()

        const manager = new OfflineManagerService(new LocalForageMocker(), new UsersService(),changesService,new ConnectionStatusService())
        const Categories = new CategoriesServiceMocker(manager,new LocalForageMocker,changesService)
        const pull = new pullChangesFromCloud(changesService, db,[])
        const cat = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        await db.set(cat.key, cat)
        const catUpdate = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis mod"
        })

        const change = new Items2Update('me', catUpdate, OperationKey.delete)
        const changes = [change]
        changesService.setChanges(changes)

        
        pull.changes.subscribe(changes=>{console.log('got changes **',changes)
        const  item = changes[0]?.item
        expect(changes.length).toEqual(1)
        expect(item['key']).toEqual(cat.key)
        expect(item['title']).toEqual(cat.title)
        expect(item['fatherKey']).toEqual(cat.fatherKey)
        expect(item['entityLabel']).toEqual(cat.entityLabel)
        expect(changes[0].owner).toEqual('me')
        expect(changes[0].operationKey).toEqual(OperationKey.delete)
    
    })

   await  pull.execute(changes, 'test')


    })



})