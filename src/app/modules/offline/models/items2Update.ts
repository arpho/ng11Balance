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
    constructor(item?: OfflineItemModelInterface, operationKey?: OperationKey) {
        this.entityLabel2Update = item.entityLabel
        this.item = item.serialize()
        this.operationKey = operationKey
        this.date = new DateModel(new Date())
        this.key = new Date().getTime() + '' // +'' cast to a string
    }

    initialize(args: {}) {
        Object.assign(this, args)
        return this
    }
    setKey(key: string) {
        this.key = key
        return this
    }

    serialize() {
        return {
            'entityLabel': '2BeUpdate',
            'operation': this.operationKey,
            item: this.item,
            'date': this.date.formatFullDate(),
            'entity': this.entityLabel2Update
        }
    }
}