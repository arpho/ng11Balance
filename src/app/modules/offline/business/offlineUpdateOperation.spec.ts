import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
import { OperationKey } from "../models/operationKey"
import { ChangesServiceMockers } from "../services/mockers/ChangeServiceMocks"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { OfflineCreateOperation } from "./offlineCreateOperation"
import { OfflineUpdateOperation } from "./offlineUpdateOperation"

var Changes:ChangesServiceMockers
var db : LocalForageMocker
var creatOP:OfflineCreateOperation
var categoryTest = new CategoryModel().initialize({
    entityLabel: "Categoria",
    fatherKey: "-LMTmZbBd6roqklYDflZ",
    key: "-Ks0UdZGtzunNoCmGGJd",
    title: "gnosis"
})
describe('create operation works',()=>{
    beforeEach(waitForAsync(()=>{
       

   


    }))
})

it('item should be properly created',async ()=>{
    Changes = new ChangesServiceMockers()
    db = new LocalForageMocker()


    creatOP = new OfflineUpdateOperation(categoryTest,Changes,db,'test',true)
    creatOP.runOperations()
    const item = await db.get(categoryTest.key)
    expect(item.item).toBeTruthy()
    expect(item.item['entityLabel']).toEqual(categoryTest.entityLabel)
    expect(item.item['title']).toEqual(categoryTest.title)

})

it('changes should be created properly',async ()=>{
    Changes = new ChangesServiceMockers()
    db = new LocalForageMocker()


    creatOP = new OfflineUpdateOperation(categoryTest,Changes,db,'test',true)
    await creatOP.runOperations()
    expect(Changes.changesList.length).toEqual(1)
    expect(Changes.changesList[0].operationKey).toEqual(OperationKey.update)
    expect(Changes.changesList[0].isSignedBy('test0')).toBeFalse()
    expect(Changes.changesList[0].item).toBeInstanceOf(CategoryModel)
    expect(Changes.changesList[0].item.title).toEqual(categoryTest.title)
})