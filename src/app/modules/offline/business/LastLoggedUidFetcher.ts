import { RawItem } from "../models/rawItem";
import { OfflineDbService } from "../services/offline-db.service";

export class LastLoggedUidFetcher {
    signatures: RawItem[]
    db: OfflineDbService
    lastLoggedSignature: RawItem
    constructor(db: OfflineDbService) {
        this.signatures = []
        this.db = db
    }

    async fetchSignatures() {
        this.signatures = await this.db.fetchAllRawItems4Entity('signatures')
        return this
    }

    getLastLogged() {
        const filter = (item: RawItem) => item.item['lastLogged'] == true
        this.lastLoggedSignature = this.signatures.filter(filter)[0]
        return this
    }

    extractUid() {
        return this.lastLoggedSignature.item['signature'].split('_')[0]
    }

    async execute() {
        return await (await this.fetchSignatures()).getLastLogged().extractUid()
    }
}