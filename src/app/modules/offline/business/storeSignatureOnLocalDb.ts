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
           this.db.set(`signature_${signaturesList.length}`,{signature:this.signature,entityLabel:'signatures'})
       
      
    }
}