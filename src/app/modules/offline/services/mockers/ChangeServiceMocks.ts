import { Items2BeSynced } from "../../models/items2BeSynced";
import { ChangesService } from "../changes.service";

export class ChangesServiceMockers extends ChangesService{
    changesList: Items2BeSynced[]=[]
    constructor(){
        super()
    }

    setChanges(changes:Items2BeSynced[]){
        this.changesList= changes
        this._items.next(changes)
    }

    async updateItem(item:Items2BeSynced):Promise<any>{
        const key = item.key
        const index = this.changesList.findIndex(obj=>obj.key==key)
        this.changesList[index]= item
        return true
    }

    delete(key:string){
        const index = this.changesList.findIndex(obj=>obj.key==key)
        delete this.changesList[index]
    }

    async createItem(item){
        this.changesList.push(item)

    }
}