import { QuestionBase } from './question-base';
import { QuestionProperties } from './questionproperties';

export class QuestionBarcode extends QuestionBase<string>{
    controlType = 'barcodeScanner'
    barcode: string
    constructor(options: QuestionProperties<string>) {
        super(options)
    }
}