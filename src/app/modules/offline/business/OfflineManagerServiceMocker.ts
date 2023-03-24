import { UsersService } from "../../user/services/users.service";
import { ChangesService } from "../services/changes.service";
import { ConnectionStatusService } from "../services/connection-status.service";
import { OfflineDbService } from "../services/offline-db.service";
import { OfflineManagerService } from "../services/offline-manager.service";

export class OfflineManagerServiceMocker extends OfflineManagerService{
  constructor(public localDb: OfflineDbService,
    public users: UsersService,
    public changes: ChangesService,
    connection: ConnectionStatusService){
    super(
      localDb,
      users,
      changes,
      connection,
    );
  }
}