import { appInitialize } from "@ionic/angular/app-initialize";
import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { DateModel } from "../../user/models/birthDateModel";
import { OfflineItemModelInterface } from "./offlineItemModelInterface";
import { OperationKey } from "./operationKey";

export class Items2Update {
    item: OfflineItemModelInterface;
    key: string
    entityLabel2Update: string
    operationKey: OperationKey;
    date: DateModel
    owner: string
    signatures: Set<string> = new Set([])
    constructor(owner: string,item?: OfflineItemModelInterface, operationKey?: OperationKey, ) {
        this.entityLabel2Update = item?.entityLabel
        this.item = item
        this.operationKey = operationKey
        this.date = new DateModel(new Date())
        this.key = String( new Date().getTime())
        this.owner=owner
        console.log("#* created change",this)
    }

    setItem(entity:OfflineItemModelInterface){
        this.item = entity
        return this
    }

    initialize(args: {}) {
        Object.assign(this, args)
        this.signatures = new Set(this.signatures)
        this.operationKey = this.operationKey|args['operation']
                                  
        return this
    }
    setKey(key: string) {
        this.key = key
        return this
    }

    setEntityLabel2Update(label:string){
        this.entityLabel2Update = label
        return this
    }

    sign(signature: string) {
        if (signature != this.owner) {  //owner does not need to sign
            this.signatures.add(signature)
        }
        return this
    }

    isSignedBy(signature: string) {
        return this.signatures.has(signature)|| this.owner==signature
    }

    serialize() {
        return {
            'entityLabel': '2BeUpdate',
            'operation': this.operationKey,
            item: `${this.item.serialize()}`,
            'date': this.date.formatFullDate(),
            'entity': this.entityLabel2Update,
            'owner': this.owner,
            'signatures': Array.from(this.signatures)
        }
    }
}