import { RxSchema } from "rxdb";
import { ItemModelInterface } from "../../item/models/itemModelInterface";

export type offlineSerializer<T extends { entityLabel: string }> = {
    
}


export interface OfflineItemModelInterface extends ItemModelInterface {
    entityLabel: string
    schema:{primaryKey:string,
    version:number,
  title:string,
properties:{}}
getSchema():RxSchema
    serialize4OfflineDb(): offlineSerializer<{entityLabel:string}>
    initialize(item:{}):OfflineItemModelInterface
}