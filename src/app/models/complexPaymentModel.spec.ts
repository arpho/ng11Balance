import { DateModel } from "../modules/user/models/birthDateModel"
import { ComplexPaymentModel } from "./ComplexPaymentModel"
import { PaymentsModel } from "./paymentModel"

describe('testing complexPaymentModel', () => {

    it('model instantiated from shoppingKart.payments with payment.key', () => {
        const payment = new ComplexPaymentModel({ 'amount': 10, paymentKey: '1', nome: 'test', paymentDate: new DateModel(new Date()).formatDate(), cpid: '123456' })
        expect(payment.amount).toEqual(10)
        expect(payment.key)
        expect(payment.paymentDate.formatDate()).toEqual(new DateModel(new Date()).formatDate())
        expect(payment.serialize4ShoppingKart().paymentKey).toEqual('1')
        expect(payment.serialize4ShoppingKart().amount).toEqual(10)
        expect(payment.serialize4ShoppingKart().paymentDate).toEqual(new DateModel(new Date()).formatDate())
        expect(payment.cpid).toBeTruthy
        expect(payment.cpid).toEqual(123456)
        expect(payment.serialize4ShoppingKart().cpid).toEqual(123456)
    })

    it('model instantiated with payment model', () => {
        const TestData = { key: '123', title: 'qwertyu', note: 'asdfghj', addebito: '12/05/2019', nome: 'cash', cpid: '123456' }
        const Payment = new PaymentsModel(TestData)
        const complexPayment = new ComplexPaymentModel(Payment)

        
        complexPayment.setAmount(10)
        complexPayment.setDate(new DateModel(new Date()))
        expect(complexPayment.key).toEqual('123')
        expect(complexPayment.title).toEqual(TestData.title)
        expect(complexPayment.nome).toEqual(TestData.nome)
        expect(complexPayment.serialize4ShoppingKart().paymentKey).toEqual('123')
        expect(complexPayment.serialize4ShoppingKart().amount).toEqual(10)
        expect(complexPayment.serialize4ShoppingKart().paymentDate).toEqual(new DateModel(new Date()).formatDate())

    })
    it("initialize initialis correctly the payment model",()=>{

        const TestData = { key: '123', title: 'qwertyu', note: 'asdfghj', addebito: '12/05/2019', nome: 'cash', cpid: '123456' }
        const Payment = new PaymentsModel(TestData)
        const complexPayment = new ComplexPaymentModel().initialize(Payment)
        complexPayment.setAmount(10)
        complexPayment.paymentDate =new DateModel(new Date(TestData.addebito)) // paymentsModel does not have a date field
        //console.log("#* cp",complexPayment)
        expect(complexPayment.key).toEqual('123')
        expect(complexPayment.title).toEqual(TestData.title)
        expect(complexPayment.nome).toEqual(TestData.nome)
        expect(complexPayment.serialize4ShoppingKart().paymentKey).toEqual('123')
        expect(complexPayment.serialize4ShoppingKart().amount).toEqual(10)
        expect(complexPayment.serialize4ShoppingKart().paymentDate).toEqual(new DateModel(new Date(TestData.addebito)).formatDate())


    })
})