import { waitForAsync } from "@angular/core/testing"
import { CategoryModel } from "src/app/models/CategoryModel"
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
        new DeleteEntityOffline(categoryTest.key,db,categoryTest.entityLabel).execute(true)
        const deleted= await db.get(categoryTest.key)
        expect(deleted.item).toBeFalsy()
    })
})