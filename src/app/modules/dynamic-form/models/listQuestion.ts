import { ListQuestionProperties } from "./listProperties";
import { QuestionBase } from "./question-base";

export class listQuestion extends QuestionBase<Object[]>{
    controlType: string="listQuestion";
    constructor(data:ListQuestionProperties){
        super(data)
    }

}