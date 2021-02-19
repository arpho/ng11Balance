import { ItemModelInterface } from "../../item/models/itemModelInterface";

export interface OfflineItemModelInterface extends ItemModelInterface{
    offlineKey:string
    dependeciesList:[string]
    signature:string
    coherent:boolean //state whether the item's key is coherent with the db
    entityKey:string

    hasDepencies():boolean
    updateDendencies?(entityKey:string,offlineKey:string,onlineKey)
    isCoherent():boolean
    serialize4Offline():{}
}