import { BehaviorSubject, Observable } from "rxjs";
import { Items2Update } from "../models/items2Update";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OperationKey } from "../models/operationKey";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";
import { Changes2Pull } from "./changes2pull";

export class pullChangesFromCloud {
    Changes: ChangesService
    localDb: OfflineDbService
    _changes:BehaviorSubject< Array<Items2Update>> = new BehaviorSubject([])
    readonly changes: Observable<Array<Items2Update>> = this._changes.asObservable()
    signature: string;
    services: OfflineItemServiceInterface[];
    constructor(changes: ChangesService, localDb: OfflineDbService,servicesList:OfflineItemServiceInterface[]) {
        this.localDb = localDb
        this.Changes = changes
        this.services = servicesList
        this.Changes.items.subscribe(async items=>{ // initialize entities in changes item
            items.forEach(item=>{})
        })
    }
    async execute(changes: Items2Update[], signature: string) {
        const changes2BePulled: Items2Update[] =[]
        const pull = new pullChangesFromCloud(this.Changes,this.localDb,this.services)
        this.Changes.items.subscribe(async items=>{
            items.forEach(async item=>{
                const Service = this.services.filter(service=>service.entityLabel==item.entityLabel2Update)[0]
                const entity = Service.getDummyItem().initialize(item.item)
                if(item.operationKey==OperationKey.create){
                   await  this.localDb.set(item.key,item.item.serialize4OfflineDb())
                }
                if(item.operationKey==OperationKey.update){
                    await this.localDb.set(item.key,item.item.serialize4OfflineDb())
                }
                if(item.operationKey==OperationKey.delete){
                   await this.localDb.remove(item.item.key)
                }
                const change= new Items2Update(item.owner,entity,item.operationKey).setItem(entity)
                changes2BePulled.push(change)
                

            })
            this._changes.next(changes2BePulled)
        })
       

    }
}