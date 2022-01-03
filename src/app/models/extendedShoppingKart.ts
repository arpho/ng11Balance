import { ItemServiceInterface } from "../modules/item/models/ItemServiceInterface";
import { DateModel } from "../modules/user/models/birthDateModel";
import { PaymentsService } from "../services/payments/payments.service";
import { ComplexPaymentModel } from "./ComplexPaymentModel";
import { PaymentsModel } from "./paymentModel";
import { ShoppingKartModel } from "./shoppingKartModel";

export class ExtendedShoppingKartModel extends ShoppingKartModel {
    payments: ComplexPaymentModel[]=[]
    pagamenti:ComplexPaymentModel[]=[]
    Payments:ItemServiceInterface
    constructor(args?:{data?:any,paymentsService:ItemServiceInterface}) {
        super(args.data)
        console.log('*** inizializzato super',this)
        this.totale= args.data.totale
        this.Payments=args.paymentsService
        console.log('*** data',args.data)
        this.initialize(args.data)
        console.log('inizializzato *** exte',this)

    }

    async fetchPayments(key:string){
        const payment = await this.Payments.items.toPromise()
        return payment.filter(item=> item.key==key)[0]
    }

    initialize(cart: any): this {
        super.initialize(cart)
        if (cart.payments) {// kart esteso, ha i pagamenti complessi
            console.log('*** si payments',cart.payment)
            cart.payments = cart.payments.map( (element:{paymentKey:string,amount:number,paymentDate:string}) => {
                var xpayment
                this.Payments.items.subscribe(payments=> {
                const payment = payments.filter(p=>p.key==element.paymentKey)[0]
                 xpayment = new ComplexPaymentModel(new PaymentsModel().initialize(payment)).setAmount(element.amount).setDate(new DateModel(new Date(element.paymentDate)))
                console.log('*** xpayment 2 map',xpayment)
            })
            this.pagamenti.push(xpayment)
                return xpayment
                

            });
            console.log('*** xkart initialized',this.payments)
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
    payedAmount() {
        const mapper = (item: ComplexPaymentModel) => item.amount
        const reducer = (pv, cv) => pv + cv
        return this.payments.map(mapper).reduce(reducer, 0)
    }
    isFullyPayed() {
        return this.totale <= this.payedAmount()
    }
}