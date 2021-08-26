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
       // setto lastLogged falso a tutte le firme
       signaturesList.forEach(async (item:RawItem)=>{
           await this.db.set(item.key,{...item.item,lastLogged:false})
       })
     

       if(signaturesList.map(sign=>sign['item']['signature']).includes(this.signature)){// la firma è presente setto lastLogged a True 
           const item = signaturesList.filter(item=>item.item['signature']==this.signature)[0]

         await   this.db.set(item.key,{ key:item.key,signature:item.item['signature'],lastLogged:true})
       }
     else{// la firma non è presente la creo e setto lastLogged a true
          await  this.db.set(`signature_${signaturesList.length}`,{signature:this.signature,entityLabel:'signatures',lastLogged:true})
     }

      
    }
}