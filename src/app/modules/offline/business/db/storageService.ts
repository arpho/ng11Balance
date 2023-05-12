import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { Storage } from '@ionic/storage-angular'

@Injectable()
export class StorageService {
  protected _storage: Storage | null = null;
  constructor(
    protected storage: Storage,
    protected loadingController: LoadingController
  ) { }
  /**
   * eseguito solo una volta
   */
  initDB(): Promise<void> {
    console.log("initDB")
    return new Promise((resolve, reject) => {
      this.storage.create().then((storage) => {
        this._storage = storage
        resolve();
      }).catch((err) => {
        reject(err)
      })


    })
  }

  async store(key: string, data): Promise<void> {
    await this.loadingController.create()
    return new Promise((resolve, reject) => {
      this._storage?.set(key, data).then(() => {
        resolve()
      }).catch((err) => {
        reject(err)
      }).finally(() => {
        this.loadingController.dismiss()
      })

    })
  }
  async findByKey(key: string): Promise<void> {
    return await this._storage.get(key)
  }

  async removeByKey(key: string): Promise<void> {
    return await this._storage.remove(key)
  }
}