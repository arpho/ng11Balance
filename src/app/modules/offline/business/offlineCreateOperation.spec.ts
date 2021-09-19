import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
import { OperationKey } from "../models/operationKey"
import { ChangesServiceMockers } from "../services/mockers/ChangeServiceMocks"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { OfflineCreateOperation } from "./offlineCreateOperation"

var Changes:ChangesServiceMockers
var db : LocalForageMocker
var creatOP:OfflineCreateOperation
const categoryTest = new CategoryModel().initialize({
    entityLabel: "Categoria",
    fatherKey: "-LMTmZbBd6roqklYDflZ",
    key: "-Ks0UdZGtzunNoCmGGJd",
    title: "gnosis"
})
describe('create operation works',()=>{
    beforeEach(waitForAsync(()=>{
        console.log('chacha')
        Changes = new ChangesServiceMockers()
        db = new LocalForageMocker()


        creatOP = new OfflineCreateOperation(categoryTest,Changes,'test',db,true)
        creatOP.runOperations()

    it('item should be properly created',async ()=>{
        const item = await db.get(categoryTest.key)
        expect(item.item).toBeTruthy()
        expect(item.item['entityLabel']).toEqual(categoryTest.entityLabel)
        expect(item.item['title']).toEqual(categoryTest.title)

    })

    it('changes should be created properly',()=>{
        expect(Changes.changesList.length).toEqual(1)
        expect(Changes.changesList[0].operationKey).toEqual(OperationKey.create)
        expect(Changes.changesList[0].owner).toEqual('test')
        expect(Changes.changesList[0].item).toBeInstanceOf(CategoryModel)
        expect(Changes.changesList[0].item.title).toEqual(categoryTest.title)
    })


    }))
})