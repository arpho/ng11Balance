
import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
import { OperationKey } from "../models/operationKey"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { CreateEntityOffline } from "./createEntityOffline"

describe('creating an offline items ',()=>{
    beforeEach(waitForAsync(()=>{
        var db= new LocalForageMocker()
        it('create a new category with connection online',async ()=>{
            const categoryTest = new CategoryModel().initialize({
                entityLabel: "Categoria",
                fatherKey: "-LMTmZbBd6roqklYDflZ",
                key: "-Ks0UdZGtzunNoCmGGJd",
                title: "gnosis"
            })
            db.set(categoryTest.key,categoryTest.serialize4OfflineDb())
            await new CreateEntityOffline(categoryTest,db,'key').execute(true)
            const newCat = await db.get(categoryTest.key)
            expect(newCat.item['title']).toEqual('gnosis')
            expect(newCat.item['enityLabel']).toEqual(categoryTest.entityLabel)
            expect(newCat.item['fatherKEY']).toEqual(categoryTest.fatherKey)
        })
        it('create a new category offline in online mode',async ()=>{
            const categoryTest = new CategoryModel().initialize({
                entityLabel: "Categoria",
                fatherKey: "-LMTmZbBd6roqklYDflZ",
                key: "-Ks0UdZGtzunNoCmGGJd",
                title: "gnosis"
            })
            db.set(categoryTest.key,categoryTest.serialize4OfflineDb())
            await new CreateEntityOffline(categoryTest,db,'key').execute(true)
            const newCat = await db.get(categoryTest.key)
            expect(newCat.item['title']).toEqual('gnosis')
            expect(newCat.item['enityLabel']).toEqual(categoryTest.entityLabel)
            expect(newCat.item['fatherKEY']).toEqual(categoryTest.fatherKey)
            const update = await db.fetchAllRawItems4Entity('update')[0]
            expect(update.item.operation).toEqual(OperationKey.create)
            expect(update.item.entity.tile).toEqual(categoryTest.title)
            expect(update.item.entity.entityLabel).toEqual(categoryTest.entityLabel)
            expect(update.item.entity.fatherKey).toEqual(categoryTest.fatherKey)
            

        })
        it('create  new category offline in online mode',async ()=>{
            const categoryTest = new CategoryModel().initialize({
                entityLabel: "Categoria",
                fatherKey: "-LMTmZbBd6roqklYDflZ",
                key: "-Ks0UdZGtzunNoCmGGJd",
                title: "gnosis"
            })
            db.set(categoryTest.key,categoryTest.serialize4OfflineDb())
            await new CreateEntityOffline(categoryTest,db,'key').execute(false)  
            const update = (await db.fetchAllRawItems4Entity('update'))[0]
            expect((await db.fetchAllRawItems4Entity('update'))[0].item['operation']).toEqual(OperationKey.create)
            expect((await db.fetchAllRawItems4Entity('update'))[0].item['entity']['fatherKey']).toEqual(categoryTest.fatherKey)
            expect((await db.fetchAllRawItems4Entity('update'))[0].item['entity']['key']).toEqual(categoryTest.key)
            expect((await db.fetchAllRawItems4Entity('update'))[0].item['entity']['title']).toEqual(categoryTest.title)
        })
    }))})
