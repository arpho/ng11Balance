import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { ItemServiceInterface } from "../../item/models/ItemServiceInterface";

export interface OfflineItemServiceInterface extends ItemServiceInterface {
    entityLabel: string; // identify entity in localForage's items
    publish: (items: Array<ItemModelInterface>) => void // publish the items fetched by offlineManager
    fetchItemsFromFirebase: () => Array<{}> //recupera la lista di oggetti da firebase che deve essere convertita   in lista di item
    initializeItems: (items: Array<{}>) => Array<ItemModelInterface>
}