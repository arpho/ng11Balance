import { ItemsList } from "./itemsList";
import { QuestionProperties } from "./questionproperties";

export interface ListQuestionProperties extends QuestionProperties<unknown>{
    createPopup:unknown
    editPopup:unknown
    itemsList:ItemsList[]
}