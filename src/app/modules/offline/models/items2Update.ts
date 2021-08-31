import { appInitialize } from "@ionic/angular/app-initialize";
import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { DateModel } from "../../user/models/birthDateModel";
import { OfflineItemModelInterface } from "./offlineItemModelInterface";
import { OperationKey } from "./operationKey";

export class Items2Update {
    item: {};
    key: string
    entityLabel2Update: string
    operationKey: OperationKey;
    date: DateModel
    owner: string
    signatures: Set<string> = new Set([])
    constructor(item?: OfflineItemModelInterface, operationKey?: OperationKey, owner?: string) {
        this.entityLabel2Update = item?.entityLabel
        this.item = item ? item.serialize() : undefined
        this.operationKey = operationKey
        this.date = new DateModel(new Date())
        this.key = new Date().getTime() + '' // +'' cast to a string
    }

    initialize(args: {}) {
        Object.assign(this, args)
        this.signatures = new Set(this.signatures)
        return this
    }
    setKey(key: string) {
        this.key = key
        return this
    }

    sign(signature: string) {
        if (signature != this.owner) {  //owner does not need to sign
            this.signatures.add(signature)
        }
    }

    isSignedBy(signature: string) {
        return this.signatures.has(signature)
    }

    serialize() {
        return {
            'entityLabel': '2BeUpdate',
            'operation': this.operationKey,
            item: this.item,
            'date': this.date.formatFullDate(),
            'entity': this.entityLabel2Update,
            'owner': this.owner,
            'signatures': Array.from(this.signatures)
        }
    }
}