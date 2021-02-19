import { CategoryModel } from './CategoryModel';

export class PricedCategory {/**
    usata come prodotto intermedio per ottenere la lista delle categorie associate con il prezzo */
    _category: CategoryModel
    _price: number
    constructor(args: { price: number, category: CategoryModel }) {
        this._price = args.price
        this._category = args.category
    }
    set category(cat: CategoryModel) {
        this._category = cat
    }
    get category() {
        return this._category
    }

    set price(price: number) {
        this._price = price
    }

    get price() {
        return this._price
    }

}