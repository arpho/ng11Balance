import { RawItem } from "../models/rawItem";
import { OfflineDbService } from "../services/offline-db.service";

export class StoreSignature{
    signature
    db:OfflineDbService
    constructor(db:OfflineDbService,signature:string){
        this.db = db
        this.signature = signature

    }

    async execute(){
        const signaturesList = await  this.db.fetchAllRawItems4Entity('signatures')
       // setto lastUsed falso a tutte le firme
       signaturesList.forEach(async (item:RawItem)=>{
           await this.db.set(item.key,{...item.item,lastUsed:false})
       })
     

       if(signaturesList.map(sign=>sign['item']['signature']).includes(this.signature)){// la firma è presente setto lastUsed a True 
           const item = signaturesList.filter(item=>item.item['signature']==this.signature)[0]

         await   this.db.set(item.key,{ key:item.key,signature:item.item['signature'],lastUsed:true})
       }
     else{// la firma non è presente la creo e setto lastUsed a true
          await  this.db.set(`signature_${signaturesList.length}`,{signature:this.signature,entityLabel:'signatures',lastUsed:true})
     }

      
    }
}