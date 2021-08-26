import { appInitialize } from "@ionic/angular/app-initialize";
import { ItemModelInterface } from "../../item/models/itemModelInterface";
import { DateModel } from "../../user/models/birthDateModel";
import { operationKey } from "./operationKey";

export class items2Update {
    item: {};
    key: string
    entityLabel2Update: string
    operationKey: operationKey;
    date: DateModel
    constructor(item: ItemModelInterface, entityLabel, operationKey: operationKey) {
        this.entityLabel2Update = entityLabel
        this.item = item.serialize()
        this.operationKey = operationKey
        this.date = new DateModel(new Date())
        this.key = new Date().getTime() + '' // +'' cast to a string
    }

    initialize(args:{}){
        Object.assign(this,args)
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