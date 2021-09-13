import { isThisTypeNode } from "typescript";
import { Items2Update } from "../models/items2Update";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { pullChangesFromCloud } from "./pullFromCloud";

export class Changes2Pull{
    changes:ChangesService
    services:OfflineItemServiceInterface[]
    localDb:OfflineDbService
    signature:string
    constrtuctor(changes:ChangesService,services:OfflineItemServiceInterface[],localDb:OfflineDbService,signature:string){
        this.changes= changes
        this.services = services
        this.localDb = localDb
        this.signature = signature

    }


    async fetchChanges(){

        const changes: Items2Update[] = []
    const pull = new pullChangesFromCloud(this.changes, this.localDb)
    this.changes.items.subscribe(async items => {
      items.forEach(item => {
        const Service = this.services.filter(service => service.entityLabel == item.entityLabel2Update)[0]
        const entity = Service.getDummyItem().initialize(item.item)
        const change = new Items2Update(item.owner, entity, item.operationKey)
        change.item = entity
        changes.push(change)
      })
      
      await pull.execute(changes,this.signature)
      console.log('* signature', this.signature)
      const changes2Pull = changes.filter(change => !change.isSignedBy(this.signature))
      console.log('changes 2 pull *', changes2Pull)

    })

    }
}