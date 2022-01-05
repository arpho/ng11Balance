import { DateModel } from "../modules/user/models/birthDateModel";
import { PaymentsModel } from "./paymentModel";

export class ComplexPaymentModel extends PaymentsModel {
    amount = 0
    paymentDate: DateModel
    paymentKey: string
    cpid:number // unique id in kart
    constructor(data?: { paymentDate: string, paymentKey: string, amount: number,cpid?:string } | PaymentsModel) {
        super()
        this.initialize(data)
        this.cpid= Number(data['cpid'])
        this.cpid = Number(this.cpid)||new Date().getTime()

    }

    initialize(data) {
        super.initialize(data)
        this.paymentDate = data?.paymentDate ? new DateModel(data.paymentDate) : undefined
        this.key = data?.paymentKey || data?.key
        return this
    }
    setPaymentKey(key: string) {
        this.paymentKey = key
        return this
    }

    setAmount(amount) {
        this.amount = amount
        return this
    }

    setDate(date: DateModel) {
        this.paymentDate = date
        return this

    }
    serialize4ShoppingKart() {// serialize 4 shoppingkart
        return { paymentKey: this.key, amount: this.amount, paymentDate: this.paymentDate.formatDate() }
    }

}