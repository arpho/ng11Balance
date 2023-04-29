import { RoleModel } from "../modules/user/models/privilegesLevelModel";

export const configs = {
  dbName:"myBalance",
  accessLevel: [
    new RoleModel({ key: "Sviluppatore", value: 1 }),
    new RoleModel({ key: "Responsabile", value: 2 }),
    new RoleModel({ key: "Utente standard", value: 3 })
  ],
  offlineEntityNumber:5
};
