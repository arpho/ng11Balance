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

    async run(service: OfflineItemServiceInterface) {
        await new CloneEntity(this.localDb, service).execute()
        const db = new OfflineDbService()
        service.offlineDbStatus = offLineDbStatus.syncing
        OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())
        service.offlineDbStatus = offLineDbStatus.up2Date
        OfflineManagerService._offlineDbStatus.next(OfflineManagerService.evaluateDbStatus())
        service.publish(service.initializeItems(await this.localDb.fetchAllRawItems4Entity(service.entityLabel)))

    }
}