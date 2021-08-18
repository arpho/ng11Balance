export class RawItem{
    item:{}
    key:string
    constructor(item:RawItem){
        Object.assign(this,item)
    }
}