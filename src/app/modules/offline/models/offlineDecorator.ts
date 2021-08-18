import {DecoratorService} from '../services/decorator-service.service'
import { OfflineManagerService } from '../services/offline-manager.service'
export function Offline(ctr:Function){
    const manager = DecoratorService.getService('manager')
    manager['registerService'](ctr)
        console.log('done')
}