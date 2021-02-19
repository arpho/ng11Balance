import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: number, precision = 2): any {
    /**
     * arrotonda l'argomento a 2 cifre dopo la virgola se non viene passato nessun altro valore
     * @param value  il valore da arrottondare
     * @param precision il numero di cifre dopo la virgola
     */
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
  }

}
