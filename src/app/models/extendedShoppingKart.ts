import { ItemServiceInterface } from "../modules/item/models/ItemServiceInterface";
import { DateModel } from "../modules/user/models/birthDateModel";
import { PaymentsService } from "../services/payments/payments.service";
import { ComplexPaymentModel } from "./ComplexPaymentModel";
import { PaymentsModel } from "./paymentModel";
import { ShoppingKartModel } from "./shoppingKartModel";

export class ExtendedShoppingKartModel extends ShoppingKartModel {
    payments: ComplexPaymentModel[] = []
    Payments: ItemServiceInterface
    total: number
    constructor(args?: { data?: any, paymentsService: ItemServiceInterface }) {
        super(args?.data)
        this.Payments = args.paymentsService
        this.initialize(args.data)

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
        else {// retro compatibilità unico pagamento 
            var payment
            this.Payments.items.subscribe(payments => {
                payment = payments.filter(p => p.key == this.pagamentoId)[0]
            })
            const pagamentoComplesso = new ComplexPaymentModel(payment)
            pagamentoComplesso.setKey(this.pagamentoId)
            pagamentoComplesso.setAmount(this.totale)
            pagamentoComplesso.setDate(this.purchaseDate)
            this.payments = [pagamentoComplesso]
        }
        return this
    }

    serialize() {
        return { ...super.serialize(), payments: this.payments.map(item => item.serialize4ShoppingKart()) }
    }

    ispayedWith(paymentKey: string) {
        const mapper = (p: ComplexPaymentModel) => p.key == paymentKey
        const reducer = (pv: boolean, cv: boolean) => cv = cv || pv
        return this.payments.map(mapper).reduce(reducer, false)
    }

    payedAmount() {
        const mapper = (item: ComplexPaymentModel) => item.amount
        const reducer = (pv: number, cv: number) => pv + cv
        return this.payments.map(mapper).reduce(reducer, 0)
    }

    isFullyPayed() {
        return super.totale <= this.payedAmount()
    }

    payedUntil(toDate: Date) {
        const mapper = (p: ComplexPaymentModel) => p.paymentDate.getTime() <= toDate.getTime() ? p.amount : 0
        const reducer = (pv: number, cv: number) => cv + pv
        return this.payments.map(mapper).reduce(reducer, 0)
    }

    paymentsInPeriod(fromDate?: DateModel, toDate?: DateModel): ComplexPaymentModel[] {
        const paymentAfter = fromDate ? (p: ComplexPaymentModel) => p.paymentDate.getTime() >= fromDate.getTime() : (p: ComplexPaymentModel) => true // se non c'è il limite inferiore la funzione è neutra
        const paymentBefore = toDate ? (p: ComplexPaymentModel) => p.paymentDate.getTime() <= toDate.getTime() : (p: ComplexPaymentModel) => true
        const paymentInTheMiddle = (p: ComplexPaymentModel) => paymentAfter(p) && paymentBefore(p)
        return this.payments.filter(paymentInTheMiddle)
    }

    howManyInstallments() {
        return new Set(this.payments.map((p: ComplexPaymentModel) => p.paymentDate.formatDate())).size
    }

}