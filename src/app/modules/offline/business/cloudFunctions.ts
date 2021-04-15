import { Operations } from '../models/Operations';

import * as firebase from 'firebase';
// import * as functions from 'firebase/functions';
import * as functions from 'firebase-functions';

import { DateModel } from '../../user/models/birthDateModel';
export class CloudFunctions {
  toBeSynchronized = (
    operation: Operations,
    entity: string,
    key: string,
    context: functions.EventContext) => {
    console.log('updating', entity, operation, key, context);
    // registriamo la chiave dell'oggetto modificato o creato
    const ref = firebase.default.database().ref(`/toBeSynchronized/${context.params.uid}/`);
    const item = {
      entityKey: entity,
      operation,
      date: new DateModel().formatDate(),
      key 
    };
    ref.push(item);
  }
}
