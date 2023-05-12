import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver'
import { Storage } from '@ionic/storage-angular'
import { LoadingController } from '@ionic/angular'
import { StorageService } from './storageService'
export class StorageSQLiteService extends StorageService {

  constructor(
    public storage: Storage,
    public LoadingController: LoadingController
  ) {
    super(storage, LoadingController)

  }
  /**
   * eseguito solo una volta
   */
  async initDB() {
    console.log('inizializzo db sqlite')
    await this.storage.defineDriver(CordovaSQLiteDriver)
    this._storage = await this.storage.create()
    console.log('sqlite db inizializzato')
  }
}