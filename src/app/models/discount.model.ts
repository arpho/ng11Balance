// import { FormGroup } from "@angular/forms/src/model";

export class DiscountModel {
    percentuale: boolean;
    sconto: number;
    descrizione: string;

    constructor(percentuale?: boolean, sconto?: number, descrizione?: string) {
        this.percentuale = !!percentuale;
        this.sconto = sconto || 0;
        this.descrizione = descrizione || '';
    }

   /*  buildFromForm(form: FormGroup) {
        this.sconto = form.controls.sconto.value;
        this.descrizione = form.controls.descrizione.value;
        this.percentuale = form.controls.percentuale.value;
        return this;
    } */
    calculateFinalPrice(price: number) {
        return price - this.calculateDiscount(price);
    }

    calculateDiscount(price:number){
        return this.percentuale ? this.sconto* price : this.sconto;
    }

}