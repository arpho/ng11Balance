import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OfflineDbService } from "../services/offline-db.service";

export class PushToCloud{
    localDb:OfflineDbService
    servicesList:OfflineItemServiceInterface[]
    constructor(localDb:OfflineDbService,servicesList:OfflineItemServiceInterface[]){
        this.localDb=localDb
        this.servicesList = servicesList
    }
}