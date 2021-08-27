import { UsersService } from "../../user/services/users.service";
import { OfflineDbService } from "../services/offline-db.service";
import { CreateEntityOffline } from "./createEntityOffline";
import { UpdateEntityOffline } from "./updateEntityOffline";

export const decoratedUpdate = (target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>) => {

    const childFunction = descriptor.value;
    descriptor.value = async (...args: any[]) => {

        if (UsersService.loggedUser.isOfflineEnabled()) {
            await new UpdateEntityOffline(args[0], new OfflineDbService()).execute(navigator.onLine)
        }
        childFunction.apply(target.constructor, args);
        return descriptor
    }
}

export const decoratedCreate = (target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>) => {

    const childFunction = descriptor.value;
    descriptor.value = async (...args: any[]) => {

        if (UsersService.loggedUser.isOfflineEnabled()) {
            args[0].key = `${args[0].entityLabel}_${new Date().getTime()}`
            await new CreateEntityOffline(args[0], new OfflineDbService()).execute(navigator.onLine)
        }
        childFunction.apply(target.constructor, args);
        return descriptor
    }
}