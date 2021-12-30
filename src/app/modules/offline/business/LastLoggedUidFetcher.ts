import { OfflineDbService } from "../services/offline-db.service";

export class LastLoggedUidFetcher {
    db: OfflineDbService
    constructor(db: OfflineDbService) {
        this.db = db
    }

    async execute() {
        const signatures = await this.db.fetchAllRawItems4Entity('signatures')
        const lastLoggedSignature = signatures.filter(item => item.item['lastLogged'] == true)[0]
        return lastLoggedSignature['signature'].split('_')[0]
    }
}