import { CategoryModel } from "src/app/models/CategoryModel"
import { Items2Update } from "./items2Update"
import { OperationKey } from "./operationKey"

describe('testing class Items2UPdate',()=>{
    const categoryTest = new CategoryModel().initialize({
        entityLabel: "Categoria",
        fatherKey: "-LMTmZbBd6roqklYDflZ",
        key: "-Ks0UdZGtzunNoCmGGJd",
        title: "gnosis"
    }) 
    

    it('instantiating an items2Update  for updating',()=>{
        const update = new Items2Update(categoryTest,OperationKey.update)
        expect(update.date).toBeTruthy()
        expect(update.operationKey).toEqual(OperationKey.update)
        expect(update.entityLabel2Update).toEqual(categoryTest.entityLabel)
        expect(update.key).toBeInstanceOf(String)
        expect(update.item['title']).toEqual(categoryTest.title)
        expect(update.item['key']).toEqual(categoryTest.key)
        expect(update.item['fatherKey']).toEqual(categoryTest.fatherKey)
    })
})