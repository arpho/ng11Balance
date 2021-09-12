import { ChangesServiceMockers } from "../services/mockers/ChangeServiceMocks"
import { pullChangesFromCloud } from "./pullFromCloud"
import { LocalForageMocker } from '../services/mockers/offlineDbServiceMocker'
import { CategoryModel } from "src/app/models/CategoryModel"
import { Items2Update } from "../models/items2Update"
import { OperationKey } from "../models/operationKey"
import { waitForAsync } from "@angular/core/testing"
var db
describe('testing pull changes', () => {
    beforeEach(waitForAsync(() => { db = new LocalForageMocker() }))



    it('the new item should have been created on localDb', () => {
        const changesService = new ChangesServiceMockers()
        const pull = new pullChangesFromCloud(changesService, db)
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
        const pull = new pullChangesFromCloud(changesService, db)
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
        pull.execute(changes, 'test')

        db.get(cat.key).then(item => {
            expect(db.db[cat.key]).toBeTruthy()
            expect(db.db[cat.key]['key']).toEqual(catUpdate.key)
            expect(db.db[cat.key]['title']).toEqual(catUpdate.title)
            expect(db.db[cat.key]['fatherKey']).toEqual(catUpdate.fatherKey)
            expect(db.db[cat.key]['entityLabel']).toEqual(catUpdate.entityLabel)
            expect(changesService.changesList[0].isSignedBy('me')).toBeTrue()
        })


    })

    it('deleting an item', async () => {
        const changesService = new ChangesServiceMockers()
        const pull = new pullChangesFromCloud(changesService, db)
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
        pull.execute(changes, 'test')

        db.get(cat.key).then(item => {
            expect(db.db[cat.key]).toBeFalsy()
            expect(changesService.changesList[0].isSignedBy('me')).toBeTrue()
        })


    })



})