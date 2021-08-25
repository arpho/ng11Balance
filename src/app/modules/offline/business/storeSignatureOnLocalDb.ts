import { OfflineDbService } from "../services/offline-db.service";

export class storeSignature{
    signature
    db:OfflineDbService
    constructor(db:OfflineDbService,signature:string){
        this.db = db
        this.signature = signature

    }

    async execute(){
       const signaturesList = await  this.db.fetchAllRawItems4Entity('signatures')
       if(!signaturesList.map(item=>item['signature']).includes(this.signature)){
           this.db.set(`signature_${signaturesList.length}`,{signature:this.signature,entityLabel:'signatures'})
       }
      
    }
}