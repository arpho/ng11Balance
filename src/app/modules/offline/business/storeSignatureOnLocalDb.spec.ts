import {StoreSignature, } from './storeSignatureOnLocalDb'
import {LocalForageMocker} from '../services/mockers/offlineDbServiceMocker'
import { waitForAsync } from '@angular/core/testing'

var db:LocalForageMocker = new LocalForageMocker()
const signature = 'Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome'
describe('storing signature',()=>{
    beforeEach(waitForAsync(()=>{db= new LocalForageMocker()
    }))
    it('no previous signature',async ()=>{
        const store= new StoreSignature(db,'Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome')
        await store.execute()
        const signs = await db.fetchAllRawItems4Entity('signatures')
        expect( signs.length).toEqual(1)
        const sign0 = await db.get('signature_0')
        
        
        expect (sign0.signature).toEqual(signature)
    })
    it('previous signatures',async ()=>{
        await db.set("signature_0",{signature:'Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome',entityLabel:'signatures',lastLogged:false})// setto una firma precedente con uguale firma e lastused falso
        await db.set("signature_1",{signature:'qwertygggggggggggggggggggggc_Linux x86_64_Chrome',entityLabel:'signatures',lastLogged:true})// setto una firma precedente con  firma diversa ma lastused vero
        const store= new StoreSignature(db,'Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome')
        await store.execute()
        const signaturesList = await  db.fetchAllRawItems4Entity('signatures')

        const signs = await db.fetchAllRawItems4Entity('signatures')
        expect(signs.length).toEqual(1)
        const sign0 = await db.get('signature_0')
        expect(sign0.signature).toEqual(signature)
        expect(sign0.lastLogged).toBeTrue()

        const sign1 = await db.get('signature_1')
        console.log('sign1 @',sign1)
        expect(sign1.lastLogged).toBeFalse()


    })
})