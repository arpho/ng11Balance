import {
  ItemModelInterface,
  Genere
} from '../../item/models/itemModelInterface';
import { ItemServiceInterface } from '../../item/models/ItemServiceInterface';
import { Value } from '../../item/models/value';
import { DateModel } from './birthDateModel';
import { RoleModel } from './privilegesLevelModel';
import { configs } from 'src/app/configs/configs';
import { QuickAction } from '../../item/models/QuickAction';
// import { EditUserPage } from '../pages/edit-user/edit-user.page';
export class UserModel implements ItemModelInterface {
  birthDate: DateModel; // { day: number; month: number; year: number };
  email: string;
  firstName: string;
  lastName: string;
  title: string;
  key: string;
  uid: string;
  level: number;
  quickActions: Array<QuickAction>;
  enabled: boolean;
  role: RoleModel;
  service: ItemServiceInterface;

  constructor(item?: {}, key?: string, ) {
    this.key = key;
    this.uid = key
    this.load(item)
  }
  initialize(user: any) {
    Object.assign(this, user)
    return this
  }


  getNote() {
    return new Value({
      value: `${this.firstName} ${this.lastName}`,
      label: 'user'
    });
  }

  getTitle() {
    return new Value({ value: this.email, label: 'user mail' });
  }

  build(item: {}) {
    const loader = ([Key, value]) => {
      this[Key] = value;
    };
    Object.entries(item).forEach(loader);
    // tslint:disable-next-line: no-string-literal
    if (item['birthDate']) {
      // tslint:disable-next-line: no-string-literal
      this.birthDate = new DateModel(item['birthDate']);
    }
    this.role = configs.accessLevel.filter(
      (access: RoleModel) => access.value === this.level
    )[0];
  }
  hasQuickActions() {
    return false;
  }
  getQuickActions() {
    return this.quickActions;
  }

  getCountingText() {
    return ' utenti';
  }

  serialize() {
    return {
      key: this.key,
      uid: this.uid||this.key,
      birthDate: this.birthDate.serialize(),
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      enabled: this.enabled,
      level: this.role.value
    };
  }

  roleFactory(level) {

    const out = configs.accessLevel.filter(
      (access: RoleModel) => access.value === this.level
    )[0]
    return out ? out : configs.accessLevel[2] //utente standard

  }

  load(args) {
    Object.assign(this, args)
    this.role = this.roleFactory(this.level)
    return this;

  }

  getValue3() {
    const value = new Value({ value: this.role.key, label: 'ruolo ' });
    return value;
  }

  getValue2() {
    const value = new Value({
      value: this.enabled ? '' : ' non abilitato',
      label: ' abilitato'
    });
    return value;
  }

  getValue4() {
    const value = new Value({
      value: this.enabled ? 'si' : 'no',
      label: ' abilitato '
    });
    return value;
  }

  getEditPopup() {
    return '/user/edit-user';
  }
  /*
  getEditPopup(item, service) {
    return "to be implemented";
  }*/

  getAggregate() {
    return new Value({ label: 'aggregato', value: 'to be implemented' });
  }

  getCreatePopup() {
    return 'to be implemented';
  }

  getElement() {
    const genere: Genere = 'o';
    return { element: 'volantinaggio', genere };
  }
}
