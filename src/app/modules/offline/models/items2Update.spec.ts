import { CategoryModel } from "src/app/models/CategoryModel"
import { Items2BeSynced } from "./items2Update"
import { OperationKey } from "./operationKey"

describe('testing class Items2UPdate', () => {
    const categoryTest = new CategoryModel().initialize({
        entityLabel: "Categoria",
        fatherKey: "-LMTmZbBd6roqklYDflZ",
        key: "-Ks0UdZGtzunNoCmGGJd",
        title: "gnosis"
    })


    it('instantiating an items2Update  for updating', () => {
        const update = new Items2BeSynced('key',categoryTest, OperationKey.update)
        expect(update.date).toBeTruthy()
        expect(update.operationKey).toEqual(OperationKey.update)
        expect(update.entityLabel2Update).toEqual(categoryTest.entityLabel)
        expect(update.key).toBeInstanceOf(String)
        expect(update.item['title']).toEqual(categoryTest.title)
        expect(update.item['key']).toEqual(categoryTest.key)
        expect(update.item['fatherKey']).toEqual(categoryTest.fatherKey)
        expect(update.owner).toEqual('key')
    })
    it('signing works',()=>{
        const update = new Items2BeSynced('key',categoryTest, OperationKey.update)
        update.sign('key')
        expect(update.signatures.size).toEqual(0)
        update.sign('key1')
        expect(update.isSignedBy('key')).toBeTrue()
        expect(update.isSignedBy('key1')).toBeTrue()
        expect(update.signatures.size).toEqual(1)

    })
})