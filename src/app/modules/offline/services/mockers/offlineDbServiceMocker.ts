import { RawItem } from "../../models/rawItem"
import { OfflineDbService } from "../offline-db.service"

export class LocalForageMocker extends OfflineDbService{
    db:{}
    constructor(){
        super()
        this.db = {}
    }
    async set(key:string, value:unknown){
        console.log('*#setting',value,key)
        this.db[key]= value
        console.log('*# db',this.db)
        console.log('* #item',this.db['signature_0'])
    }
    
    async get(key:string){
        console.log('*getting',key)
        console.log('* item',this.db[key])
        return this.db[key]
    }

    iterate(callback:(value:unknown,key:string)=>void){
        for( const[key,value]of Object.entries(this.db)){
            callback(value,key)
        }
    }

    async fetchAllRawItems4Entity(entityLabel:string){
        console.log('* check', entityLabel,this.db)
        const  out = []
        this.iterate((value:unknown,key:string)=>{
            if(value['entityLabel']== entityLabel){
                out.push(new RawItem({item:value,key:key}))
                console.log('*checking',value,key)
            }
        })
        return out
    }
}