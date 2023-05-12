import { Storage } from "@ionic/storage-angular";
import { LoadingController } from "@ionic/angular";
import { StorageService } from "./storageService";
import { StorageSQLiteService } from "./storageSQLiteService";
import { PlatformStrategyService } from "../../services/platform.strategy.service";



const storageOflineServiceFactory = (
  platformStrategy:PlatformStrategyService,
  storage:Storage,
  LoadingController:LoadingController) =>{
    if(platformStrategy.isMobile()){
      return new StorageSQLiteService(storage,LoadingController);
    }
    else{
      return new StorageService(storage,LoadingController)
    }

  }

  /** */