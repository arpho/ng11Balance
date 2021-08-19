import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { ItemServiceInterface } from "../../item/models/ItemServiceInterface";
import { offLineDbStatus } from "./offlineDbStatus";

export interface OfflineItemServiceInterface extends ItemServiceInterface {
    entityLabel: string; // identify entity in localForage's items
    publish: (items: Array<ItemModelInterface>) => void // publish the items fetched by offlineManager
    fetchItemsFromCloud: (callback:(items:{}[])=>void) => void//recupera la lista di oggetti da firebase che deve essere convertita   in lista di item
    initializeItems: (items: Array<{}>) => Array<ItemModelInterface>

}