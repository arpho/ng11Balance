import { LocalForageMocker } from '../services/mockers/offlineDbServiceMocker'
import { waitForAsync } from '@angular/core/testing'
import { CategoryModel } from 'src/app/models/CategoryModel'
import { UpdateEntityOffline } from './updateEntityOffline'
import { OperationKey } from '../models/operationKey'
import { CreateEntityOffline } from './createEntityOffline'
import { title } from 'node:process'
var db: LocalForageMocker = new LocalForageMocker()

var db: LocalForageMocker = new LocalForageMocker()
describe('createEntityOffline should create the rigth data on local b',()=>{

    beforeEach(waitForAsync(()=>{
        db = new LocalForageMocker()
    }))

    it("item correctly created",async ()=>{
        const categoryTest = new CategoryModel().initialize({
            entityLabel: "Categoria",
            fatherKey: "-LMTmZbBd6roqklYDflZ",
            key: "-Ks0UdZGtzunNoCmGGJd",
            title: "gnosis"
        })
       await new CreateEntityOffline(categoryTest,db).execute(true)
       const item= await db.get(categoryTest.key)
       expect(item).toBeTruthy()
       expect(item['entityLabel']).toEqual(categoryTest.entityLabel)
       expect(item['fatherkey']).toEqual(categoryTest.fatherKey)
       expect(item[title]).toEqual(categoryTest.title)
    })
})