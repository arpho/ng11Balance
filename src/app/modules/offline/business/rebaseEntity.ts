import { offLineDbStatus } from "../models/offlineDbStatus";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OfflineDbService } from "../services/offline-db.service";
import { CloneEntity } from "./cloneEntityFromFirebase";

export class RebaseEntity {

    localDb: OfflineDbService
    refreshStatus:()=>void

    constructor(localDb: OfflineDbService,refreshStatus?:()=>void) {
        this.localDb = localDb
    }

    async synchronizes(service: OfflineItemServiceInterface, message?: (data: number) => void) {/**
     * @service:service relativo all'entità sincronizzato
        @message funzione di callback che presenta messaggio relativo al numero di items
     */

        const itemsNumber = await new CloneEntity(this.localDb, service).execute(n => {
            if (message) {
                message(n)
            }
        })
        service.offlineDbStatus = offLineDbStatus.syncing
        if(this.refreshStatus){
        this.refreshStatus()}
        service.offlineDbStatus = offLineDbStatus.up2Date
        if(this.refreshStatus){
            this.refreshStatus()}


    }
}