import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OfflineDbService } from "../services/offline-db.service";

export class Push2Cloud{
    localDb:OfflineDbService
    servicesList:OfflineItemServiceInterface[]
    constructor(localDb:OfflineDbService,servicesList:OfflineItemServiceInterface[]){
        this.localDb=localDb
        this.servicesList = servicesList
    }

    async execute(){
        this.localDb.fetchAllRawItems4Entity('update')
    }
}