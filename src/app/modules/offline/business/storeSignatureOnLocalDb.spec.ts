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
        await db.set("signature_0",{signature:'Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome',entityLabel:'signatures',lastUsed:false})// setto una firma precedente con uguale firma e lastused falso
        await db.set("signature_1",{signature:'qwertygggggggggggggggggggggc_Linux x86_64_Chrome',entityLabel:'signatures',lastUsed:true})// setto una firma precedente con  firma diversa ma lastused vero
        const store= new StoreSignature(db,'Qfe9bcGcUxTIKmL9ccn76z12gzE2_Linux x86_64_Chrome')
        await store.execute()
        console.log('db#',db)
        const signaturesList = await  db.fetchAllRawItems4Entity('signatures')
        console.log('#signaturesList',signaturesList)
        console.log('signs #',signaturesList.map(sign=>sign['item']['signature']))
        console.log('# already there',signaturesList.map(sign=>sign['item']['signature']).includes(signature))
        const signs = await db.fetchAllRawItems4Entity('signatures')
        expect(signs.length).toEqual(1)
        const sign1 = await db.get('signature_0')
        expect(sign1.signature).toEqual(signature)
        expect(sign1.lastUsed).toBeTrue


    })
})