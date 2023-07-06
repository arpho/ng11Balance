import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { ItemServiceInterface } from "../../item/models/ItemServiceInterface";
import { offLineDbStatus } from "./offlineDbStatus";
import { OfflineItemModelInterface } from "./offlineItemModelInterface";

export interface OfflineItemServiceInterface extends ItemServiceInterface {
    entityLabel: string; // identify entity in localForage's items
    publish: (items: Array<ItemModelInterface>) => void // publish the items fetched by offlineManager
    fetchItemsFromCloud: (callback: (items: {}[]) => void) => void//recupera la lista di oggetti da firebase che deve essere convertita   in lista di item
    initializeItems: (items: Array<{}>) => Array<ItemModelInterface>
    loadItemFromLocalDb(): Promise<ItemModelInterface[]>
    offlineDbStatus: offLineDbStatus
    getDummyItem(): OfflineItemModelInterface
    setHref()


    getItem(key: string): Promise<ItemModelInterface>;
    /**
     * this method fetch the Item freom the off line db
     * @param key :string item's key
     * @return Promise<ItemModelInterface
     */
    getItemOffline(key: string): Promise<ItemModelInterface>
    /**
     * 
     * @param key : string key of the item
     * @return Promise<ItemModelInterface
     */
    getItemOnLine(key: string): Promise<ItemModelInterface>

}