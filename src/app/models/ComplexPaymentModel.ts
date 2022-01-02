import { DateModel } from "../modules/user/models/birthDateModel";
import { PaymentsModel } from "./paymentModel";

export class ComplexPaymentModel extends PaymentsModel {
    amount = 0
    paymentDate: DateModel
    paymentKey: string
    constructor(data?: {  amount: 0, paymentDate: string,}) {
        super()
        this.initialize(data)

    }

    initialize(data) {
        Object.assign(this, data)
        this.paymentDate = new DateModel(data.paymentDate)
        return this
    }
    setPaymentKey(key:string){
        this.paymentKey= key
    }

    setAmount(amount){
        this.amount = amount
    }

    setDate(date:DateModel){
        this.paymentDate= date

    }
    serialize(){
        return {...this.serialize(),amount:this.amount,payment:this.paymentDate.formatDate()}
    }

}