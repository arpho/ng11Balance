import { Items2Update } from "../../models/items2Update";
import { ChangesService } from "../changes.service";

export class ChangesServiceMockers extends ChangesService{
    changesList: Items2Update[]=[]
    constructor(){
        super()
    }

    setChanges(changes:Items2Update[]){
        this.changesList= changes
    }

    update(key:string,item:Items2Update){
        const index = this.changesList.findIndex(obj=>obj.key==key)
        this.changesList[index]= item
    }

    delete(key:string){
        const index = this.changesList.findIndex(obj=>obj.key==key)
        delete this.changesList[index]
    }
}