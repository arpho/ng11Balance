import { ComplexPaymentModel } from "./ComplexPaymentModel";
import { ShoppingKartModel } from "./shoppingKartModel";

export class ExtendedShoppingKartModel extends ShoppingKartModel {
    payments: ComplexPaymentModel[]
    constructor(data?) {
        super(data)
        this.initialize(data)

    }

    initialize(cart: any): this {
        super.initialize(cart)
        if (cart.payments) {// kart esteso, ha i pagamenti complessi
            this.payments = []
            cart.array.forEach(element => {
                const payment = new ComplexPaymentModel(element)
                this.payments.push(payment)

            });
        }
        else {// retro compatibilità
            const payment = new ComplexPaymentModel()
            payment.setKey(this.pagamento.key)
            payment.setAmount(this.totale)
            payment.setDate(this.purchaseDate)
            this.payments = [payment]
        }
        return this
    }
    payedAmount() {
        const mapper = (item: ComplexPaymentModel) => item.amount
        const reducer = (pv, cv) => pv + cv
        return this.payments.map(mapper).reduce(reducer, 0)
    }
    isFullyPayed() {
        return this.totale <= this.payedAmount()
    }
}