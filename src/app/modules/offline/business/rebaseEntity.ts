import { offLineDbStatus } from "../models/offlineDbStatus";
import { OfflineItemServiceInterface } from "../models/offlineItemServiceInterface";
import { OfflineDbService } from "../services/offline-db.service";
import { OfflineManagerService } from "../services/offline-manager.service";
import { CloneEntity } from "./cloneEntityFromFirebase";

export class RebaseEntity {

    localDb: OfflineDbService
    manager: OfflineManagerService

    constructor(localDb: OfflineDbService, manager: OfflineManagerService) {
        this.localDb = localDb
        this.manager = manager
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
        OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())
        service.offlineDbStatus = offLineDbStatus.up2Date
        OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())
        service.publish(service.initializeItems(await this.localDb.fetchAllRawItems4Entity(service.entityLabel)))


    }
}