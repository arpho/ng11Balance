import {StoreSignature, } from './storeSignatureOnLocalDb'
import {LocalForageMocker} from '../services/mockers/offlineDbServiceMocker'

var db:LocalForageMocker 
describe('storing signature',()=>{
    beforeEach(()=>{
        db= new LocalForageMocker()

    })
    it('no previous signature',async ()=>{
        const store= new StoreSignature(db,'Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome')
        await store.execute()
        const signs = await db.fetchAllRawItems4Entity('signatures')
        console.log('* sign',signs)
        expect( signs.length).toEqual(1)
        const res = await db.get('signature_0')
        console.log('res#',res.signature)
        
        
        expect (res.signature).toEqual('Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome')
    })
})