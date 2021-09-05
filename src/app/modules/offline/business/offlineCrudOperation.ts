import { Items2Update } from "../models/items2Update";
import { OfflineItemModelInterface } from "../models/offlineItemModelInterface";
import { ChangesService } from "../services/changes.service";
import { OfflineDbService } from "../services/offline-db.service";

export interface offlineCrudOperation{
    changes: ChangesService
    signature: string
    item: OfflineItemModelInterface
    item2Update: Items2Update
    localDb: OfflineDbService
}