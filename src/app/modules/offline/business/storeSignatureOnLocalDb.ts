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
       
       if(signaturesList.map(sign=>sign['item']['signature']).includes(this.signature)){
           const item = signaturesList.filter(item=>item.item['signature']==this.signature)[0]
           this.db.set(item.key,{ key:item.key,signature:item.item['signature'],lastUsed:true})
       }
     else{
           this.db.set(`signature_${signaturesList.length}`,{signature:this.signature,entityLabel:'signatures'})
     }
      
    }
}