import { ChangesServiceMockers } from "../services/mockers/ChangeServiceMocks"
import { pullChangesFromCloud } from "./pullFromCloud"
import {LocalForageMocker} from '../services/mockers/offlineDbServiceMocker'
import { CategoryModel } from "src/app/models/CategoryModel"
import { Items2Update } from "../models/items2Update"
import { OperationKey } from "../models/operationKey"

describe('testing create operation',()=>{
    const db = new LocalForageMocker()
    const changesService = new ChangesServiceMockers()
    const pull = new pullChangesFromCloud(changesService,db)
    const cat = new CategoryModel().initialize({
        entityLabel: "Categoria",
        fatherKey: "-LMTmZbBd6roqklYDflZ",
        key: "-Ks0UdZGtzunNoCmGGJd",
        title: "gnosis"
    })
    const change = new Items2Update('me',cat,OperationKey.create)
    const changes = [change]
    changesService.setChanges(changes)

})