import { ItemsList } from "./itemsList";
import { QuestionProperties } from "./questionproperties";

export interface ListQuestionProperties extends QuestionProperties<unknown>{
    createPage:unknown
    editPage:unknown
    itemsList:ItemsList[]
}