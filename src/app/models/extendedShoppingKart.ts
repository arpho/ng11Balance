import { ItemServiceInterface } from "../modules/item/models/ItemServiceInterface";
import { DateModel } from "../modules/user/models/birthDateModel";
import { PaymentsService } from "../services/payments/payments.service";
import { ComplexPaymentModel } from "./ComplexPaymentModel";
import { PaymentsModel } from "./paymentModel";
import { ShoppingKartModel } from "./shoppingKartModel";

export class ExtendedShoppingKartModel extends ShoppingKartModel {
    payments: ComplexPaymentModel[] = []
    pagamenti: ComplexPaymentModel[] = []
    Payments: ItemServiceInterface
    constructor(args?: { data?: any, paymentsService: ItemServiceInterface }) {
        super(args.data)
        console.log('*** inizializzato super', this)
        this.totale = args.data.totale
        this.Payments = args.paymentsService
        console.log('*** data', args.data)
        this.initialize(args.data)
        console.log('inizializzato *** exte', this)

    }


    initialize(cart: any): this {
        super.initialize(cart)
        if (cart.payments) {// kart esteso, ha i pagamenti complessi
            const pagamenti: ComplexPaymentModel[] = []
            cart.payments.forEach((element: { paymentKey: string, amount: number, paymentDate: string }) => {

                this.Payments.items.subscribe(payments => {
                    const payment = payments.filter(p => p.key == element.paymentKey)[0]
                    const xpayment = new ComplexPaymentModel(new PaymentsModel().initialize(payment)).setAmount(element.amount).setDate(new DateModel(new Date(element.paymentDate)))
                    pagamenti.push(xpayment)
                })
            });
            this.payments = pagamenti
        }
        else {// retro compatibilità
            const payment = new ComplexPaymentModel(this.pagamento)
            payment.setKey(this.pagamento.key)
            payment.setAmount(this.totale)
            payment.setDate(this.purchaseDate)
            this.payments = [payment]
        }
        return this
    }
    serialize() {
        return { ...super.serialize(), payments: this.payments.map(item => item.serialize4ShoppingKart()) }
    }
    payedAmount() {
        const mapper = (item: ComplexPaymentModel) => item.amount
        const reducer = (pv: number, cv: number) => pv + cv
        return this.payments.map(mapper).reduce(reducer, 0)
    }

    isFullyPayed() {
        return this.totale <= this.payedAmount()
    }
}