import { waitForAsync } from "@angular/core/testing"
import { LocalForageMocker } from "../services/mockers/offlineDbServiceMocker"
import { LastLoggedUidFetcher } from "./LastLoggedUidFetcher"
var db: LocalForageMocker
var fetcher: LastLoggedUidFetcher

describe('fetchLastLoggedUid work', () => {
    beforeEach(waitForAsync => () => {



    })
})
it('testing fetchSignature', async () => {
    db = new LocalForageMocker()
    fetcher = new LastLoggedUidFetcher(db)
    console.log('***', fetcher)
    const uid0 = '0_linux_chrome'
    const uid1 = '1_linux_chrome'
    const uid2 = '2_linux_chrome'
    await db.set("signature_0", { signature: uid0, entityLabel: 'signatures', lastLogged: true })
    await db.set("signature_1", { signature: uid1, entityLabel: 'signatures', lastLogged: false })
    await db.set("signature_2", { signature: uid2, entityLabel: 'signatures', lastLogged: false })
    await fetcher.fetchSignatures()
    expect(fetcher.signatures.length).toEqual(3)

})

it('testing getLastLogged', async () => {
    db = new LocalForageMocker()
    fetcher = new LastLoggedUidFetcher(db)
    console.log('***', fetcher)
    const uid0 = '0_linux_chrome'
    const uid1 = '1_linux_chrome'
    const uid2 = '2_linux_chrome'
    await db.set("signature_0", { signature: uid0, entityLabel: 'signatures', lastLogged: true })
    await db.set("signature_1", { signature: uid1, entityLabel: 'signatures', lastLogged: false })
    await db.set("signature_2", { signature: uid2, entityLabel: 'signatures', lastLogged: false })
    await fetcher.fetchSignatures()
    fetcher.getLastLogged()
    expect(fetcher.lastLoggedSignature.key).toEqual('signature_0')

})
it('testing extractUid', async () => {
    db = new LocalForageMocker()
    fetcher = new LastLoggedUidFetcher(db)
    console.log('***', fetcher)
    const testUid = 'qwerty'
    const uid0 = `${testUid}_linux_chrome`
    const uid1 = '1_linux_chrome'
    const uid2 = '2_linux_chrome'
    await db.set("signature_0", { signature: uid0, entityLabel: 'signatures', lastLogged: true })
    await db.set("signature_1", { signature: uid1, entityLabel: 'signatures', lastLogged: false })
    await db.set("signature_2", { signature: uid2, entityLabel: 'signatures', lastLogged: false })
    const uid = await fetcher.execute()
    expect(uid).toEqual(testUid)

})
it('testing integration', async () => {
    db = new LocalForageMocker()
    fetcher = new LastLoggedUidFetcher(db)
    console.log('***', fetcher)
    const uid0 = '0_linux_chrome'
    const uid1 = '1_linux_chrome'
    const uid2 = '2_linux_chrome'
    await db.set("signature_0", { signature: uid0, entityLabel: 'signatures', lastLogged: true })
    await db.set("signature_1", { signature: uid1, entityLabel: 'signatures', lastLogged: false })
    await db.set("signature_2", { signature: uid2, entityLabel: 'signatures', lastLogged: false })
    await fetcher.fetchSignatures()
    fetcher.getLastLogged()
    expect(fetcher.extractUid()).toEqual('0')

})