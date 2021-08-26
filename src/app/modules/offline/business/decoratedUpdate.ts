import { UsersService } from "../../user/services/users.service";
import { OfflineDbService } from "../services/offline-db.service";
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