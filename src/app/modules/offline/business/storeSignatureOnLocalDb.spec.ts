import {StoreSignature, } from './storeSignatureOnLocalDb'
import {LocalForageMocker} from '../services/mockers/offlineDbServiceMocker'
import { waitForAsync } from '@angular/core/testing'

const db:LocalForageMocker = new LocalForageMocker()
describe('storing signature',()=>{
    beforeEach(waitForAsync(()=>{
    }))
    it('no previous signature',async ()=>{
        const store= new StoreSignature(db,'Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome')
        await store.execute()
        const signs = await db.fetchAllRawItems4Entity('signatures')
        expect( signs.length).toEqual(1)
        const sign0 = await db.get('signature_0')
        
        
        expect (sign0.signature).toEqual('Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome')
    })
    it('previous signatures',async ()=>{
        const store= new StoreSignature(db,'Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome')
        await store.execute()
        const signs = await db.fetchAllRawItems4Entity('signatures')
        expect(signs.length).toEqual(2)
        const sign1 = await db.get('signature_1')
        expect(sign1.signature).toEqual('Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome')


    })
})