import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { OfflineDbService } from "../services/offline-db.service";

export class UpdateEntityOffline {
    entity: OfflineItemModelInterface
    db: OfflineDbService
    constructor(entity: OfflineItemModelInterface, db: OfflineDbService) {
        this.db = db
        this.entity = entity
    }

    async execute(isOnline:boolean){
        await this.db.set(this.entity.key,{...this.entity.serialize4OfflineDb()}) 
        if(!isOnline){// se online non serve registrare la modifica

        }
        else{
            // registro la modifica che sarà riportata onLine appena possibile
            await this.db.set(new Date().getTime+'',{entityLabel:'update','entity':this.entity.serialize4OfflineDb()})
        }
    }
}