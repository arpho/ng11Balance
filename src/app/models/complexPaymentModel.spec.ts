import { DateModel } from "../modules/user/models/birthDateModel"
import { ComplexPaymentModel } from "./ComplexPaymentModel"
import { PaymentsModel } from "./paymentModel"

describe('testing complexPaymentModel',()=>{

    it('model instantiated from shoppingKart.payments with payment.key',()=>{
        const payment = new ComplexPaymentModel({'amount':10,paymentKey:'1',paymentDate:new DateModel(new Date()).formatDate()})
        expect(payment.amount).toEqual(10)
        expect(payment.key)
        expect(payment.paymentDate.formatDate()).toEqual(new DateModel(new Date()).formatDate())
    })

    it('model instantiated with payment model',()=>{
        const TestData = { key: '123', title: 'qwertyu', note: 'asdfghj', addebito: '12/05/2019', nome: 'cash' }
        const Payment = new PaymentsModel(TestData)
        const complexPayment= new ComplexPaymentModel(Payment)
        expect(complexPayment.key).toEqual('123')
        expect(complexPayment.title).toEqual(TestData.title)
        expect(complexPayment.nome).toEqual(TestData.nome)

    })
})