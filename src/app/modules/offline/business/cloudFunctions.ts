import { Operations } from '../models/Operations';

import * as firebase from 'firebase';
// import * as functions from 'firebase/functions';
import * as functions from 'firebase-functions';

import { DateModel } from '../../user/models/birthDateModel';
export class CloudFunctions {
  toBeSynchronized = (
    operation: Operations,
    entity: string,
    data: functions.Change<functions.database.DataSnapshot>,
    context: functions.EventContext) => {
    console.log('updating', entity, operation, data, context);
    const ref = firebase.default.database().ref(`/toBeSynchronized/${context.params.uid}/`);
    const item = {
      entityKey: entity,
      operation,
      date: new DateModel().formatDate(),
      item_key: data.after.key
    };
    ref.push(item);
  }
}
