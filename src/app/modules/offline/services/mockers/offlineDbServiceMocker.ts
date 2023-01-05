import { RawItem } from "../../models/rawItem"
import { OfflineDbService } from "../offline-db.service"

export class LocalForageMocker extends OfflineDbService {
    public db: {}
    constructor() {
        super()
        this.db = {}
    }
    async set(key: string, value: unknown) {
        console.log("setting #*",key,value)
        this.db[key] = value
        console.log("db #*",this.db)

    }

    async get(key: string) {
        console.log("#* db and key ",this.db,key,this.db,this.db[key])
        return new RawItem({ 'key': key, 'item': this.db[key] })
    }

    iterate(callback: (value: unknown, key: string) => void) {
        for (const [key, value] of Object.entries(this.db)) {

            callback(value, key)
        }
    }

    async remove(key: string) {
        delete this.db[key]
    }

    async fetchAllRawItems4Entity(entityLabel: string) {

        const out: RawItem[] = []
        this.iterate((value: unknown, key: string) => {
            if (value['entityLabel'] == entityLabel) {
                out.push(new RawItem({ item: value, key: key }))
            }
        })
        return out
    }
}