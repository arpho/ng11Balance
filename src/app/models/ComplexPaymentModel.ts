import { DateModel } from "../modules/user/models/birthDateModel";
import { PaymentsModel } from "./paymentModel";

export class ComplexPayment extends PaymentsModel {
    amount = 0
    paymentDate: DateModel
    constructor(data: {  amount: 0, paymentDate: string,}) {
        super()
        this.initialize(data)

    }

    initialize(data) {
        Object.assign(this, data)
        this.paymentDate = new DateModel(data.paymentDate)
        return this
    }

    serialize(){
        return {...this.serialize(),amount:this.amount,payment:this.paymentDate.formatDate()}
    }

}