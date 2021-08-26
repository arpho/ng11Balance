import { UsersService } from "../../user/services/users.service";
import { OfflineDbService } from "../services/offline-db.service";
import { UpdateEntityOffline } from "./updateEntityOffline";

export const decoratedUpdate = (target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>) => {
    if (navigator.onLine) {
        console.log('online');
    } else {
        console.log('offline');
    }
    console.log('decorated target ', target)
    console.log('property key', propertyKey)
    console.log('descriptor', descriptor)
    console.log('descriptor value', descriptor.value)
    const childFunction = descriptor.value;
    descriptor.value = async (...args: any[]) => {
        console.log('constructor', target.constructor)
        console.log('args', args)
        console.log('descriptor', descriptor)
        console.log('status', navigator.onLine)
        console.log('offlineEnabled', UsersService.loggedUser.isOfflineEnabled())
        //await new UpdateEntityOffline(args[0], new OfflineDbService()).execute(navigator.onLine)
        childFunction.apply(target.constructor, args);
        return descriptor
    }
}