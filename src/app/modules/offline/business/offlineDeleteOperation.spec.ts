import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
import { OperationKey } from "../models/operationKey"
import { ChangesServiceMockers } from "../services/mockers/ChangeServiceMocks"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { OfflineCreateOperation } from "./offlineCreateOperation"
import { OfflineDeleteOperation } from "./offlineDeleteOperation"
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



it('changes should be created properly',async ()=>{
    Changes = new ChangesServiceMockers()
    db = new LocalForageMocker()
    const cat = categoryTest = new CategoryModel().initialize({
        entityLabel: "Categoria",
        fatherKey: "-LMTmZbBd6roqklYDflZ",
        key: "-Ks0UdZGtzunNoCmGGJd",
        title: "gnosis"
    })
    db.set(cat.key,cat.serialize4OfflineDb())
    const dummy = new CategoryModel().setKey(cat.key)
    const deleteOp = new OfflineDeleteOperation('test',dummy,db,Changes,true)

    await deleteOp.runOperations()
    expect(Changes.changesList.length).toEqual(1)
    expect(Changes.changesList[0].operationKey).toEqual(OperationKey.delete)
    expect(Changes.changesList[0].isSignedBy('test0')).toBeFalse()
    expect(Changes.changesList[0].isSignedBy('test')).toBeTruthy()
    expect(Changes.changesList[0].item).toBeInstanceOf(CategoryModel)
    expect(Changes.changesList[0].item.title).toBeFalsy()
    expect((await db.get(cat.key)).item).toBeFalsy()
})