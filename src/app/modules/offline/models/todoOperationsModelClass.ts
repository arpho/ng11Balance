import { DateModel } from '../../user/models/birthDateModel'
import { Operations } from './Operations'

export class TodoOPeration {

  itemKey: string

  date: DateModel

  signature: string

  sinchronizedByList: [string]

  operation: Operations


  constructor(op: { itemKey: string, date: string, operation: Operations, signature: string }) {

    Object.assign(this, op)

    this.date = new DateModel(op.date)

  }

  serialize() {
    
    return {

      'itemKey': this.itemKey,

      date: this.date.formatDate(),

      sinchronizedByList: this.sinchronizedBy,

      operation: this.operation,

      signature: this.signature

    }
  }


  sinchronizedBy(signature: string) {

    this.sinchronizedByList.push(signature)

  }


  hasBeenSinchronizedBy(signature: string) {

    return this.sinchronizedByList.indexOf(signature) > -1

  }
}