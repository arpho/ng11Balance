import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
import { OperationKey } from "../models/operationKey"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { DeleteEntityOffline } from "./deleteEntityOffline"

var db: LocalForageMocker = new LocalForageMocker()

describe("we should update an entity offline and when needed  add an update item", () => {
    beforeEach(waitForAsync(() => {
        db = new LocalForageMocker()
    }))
    it('deleting offline item in online mode',async ()=>{
        const categoryTest = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        db.set(categoryTest.key, categoryTest.serialize4OfflineDb())
        new DeleteEntityOffline(categoryTest.key,db,categoryTest.entityLabel,'key').execute(true)
        const deleted= await db.get(categoryTest.key)
        expect(deleted.item).toBeFalsy()
        
    })
    it('deleting item in offline',async ()=>{
        const categoryTest = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
        db.set(categoryTest.key, categoryTest.serialize4OfflineDb()) 
        new DeleteEntityOffline(categoryTest.key,db,categoryTest.entityLabel,'key').execute(false)
        const update = (await db.fetchAllRawItems4Entity('update'))[0]
        //console.log('update *',await db.fetchAllRawItems4Entity('update'),(await db.fetchAllRawItems4Entity('update'))[0])
        expect((await db.fetchAllRawItems4Entity('update'))[0].item['operation']).toEqual(OperationKey.delete)
        expect((await db.fetchAllRawItems4Entity('update'))[0].item['itemKey']).toEqual(categoryTest.key)
        expect((await db.fetchAllRawItems4Entity('update'))[0].item['table']).toEqual(categoryTest.entityLabel)
    })
})