import { QuestionBase } from '../models/question-base';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { SelectorProperties } from '../../item/models/selectorItemsProperties';
import { ItemModule } from '../../item/item.module';
import { ItemModelInterface } from '../../item/models/itemModelInterface';
// tslint:disable:semicolon


export class SelectorQuestion extends QuestionBase<CategoryModel> {
    controlType = 'itemSelector';
    type: CategoryModel;
    constructor(options: SelectorProperties) {
        super(options);
    }
    selectedItem(item: ItemModelInterface) {
    }
}
