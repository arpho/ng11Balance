import {StoreSignature, } from './storeSignatureOnLocalDb'
import {LocalForageMocker} from '../services/mockers/offlineDbServiceMocker'
import { waitForAsync } from '@angular/core/testing'
import { CategoryModel } from 'src/app/models/CategoryModel'
import { UpdateEntityOffline } from './updateEntityOffline'

var db:LocalForageMocker = new LocalForageMocker()
describe("we should update an entity offline and when needed  add an update item",()=>{
    beforeEach(waitForAsync(()=>{db= new LocalForageMocker()
    }))
    it('updating entity with online= true',async ()=>{

        const categoryTest= new CategoryModel().initialize({
            entityLabel: "Categoria",
        fatherKey: "-LMTmZbBd6roqklYDflZ",
        key: "-Ks0UdZGtzunNoCmGGJd",
        title: "gnosis"})
        db = new LocalForageMocker()
        db.set(categoryTest.key,categoryTest.serialize4OfflineDb())
        categoryTest.title='test'
        await new UpdateEntityOffline(categoryTest,db).execute(true)
        it("entity correctly updated",async ()=>{
            const rawCategory = await db.get(categoryTest.key)
            console.log('raw updated cat',rawCategory)
            const updatedCategory = new CategoryModel().initialize(rawCategory)
            expect(rawCategory.entityLabel).toEqual(categoryTest.entityLabel)
            expect(updatedCategory.title).toEqual('test')
            const updated = await db.fetchAllRawItems4Entity('update')
            expect(updated.length).toEqual(0)

        })
    })
})