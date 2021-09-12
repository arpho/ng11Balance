import { updateSetAccessor } from "typescript";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OperationKey } from "../models/operationKey";
import { RawItem } from "../models/rawItem";
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker";
import { OfflineDbService } from "../services/offline-db.service";

export class Push2Cloud{
    localDb:LocalForageMocker
    servicesList:OfflineItemServiceInterface[]
    constructor(localDb:LocalForageMocker,servicesList:OfflineItemServiceInterface[]){
        this.localDb=localDb
        this.servicesList = servicesList
    }

    filterService(change:RawItem){
        return this.servicesList.filter(service=>service.entityLabel==change.item['entity']['entityLabel'])[0]

    }

    async execute(){
       const updates = await this.localDb.fetchAllRawItems4Entity('update')
       updates.forEach(async change=>{
           const service = this.filterService(change)
           const entity = service.getDummyItem().initialize(change.item['entity'])
           if (change.item['operation']==OperationKey.create){
           service.createItem(entity)}
           if (change.item['operation']==OperationKey.update){
           service.updateItem(entity)}
           if (change.item['operation']==OperationKey.delete){
           service.deleteItem(entity.key)}
            await this.localDb.remove(change.key)
           
       })
    }
}