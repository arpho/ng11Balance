import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { CloudFunctions } from "../../src/app/modules/offline/business/cloudFunctions"
import { Operations } from "../../src/app/modules/offline/models/Operations";
admin.initializeApp();



const getUpdatedUser = (event: any) => {
  const compare = (obj1: any, obj2: any) =>
    JSON.stringify(obj1) === JSON.stringify(obj2);
  return Object.keys(event.after.val()).filter(
    key => !compare(event.after.val()[key], event.before.val()[key])
  );
};

const setClaims = async (data: {
  email: string;
  level: number;
  offlineEnabled: boolean,
  enabled: boolean;
}) => {
  console.log("setting claims", data);
  const authUser = await admin.auth().getUserByEmail(data.email); // .catch(v=>{console.log('exception',v)});
  console.log("authUser", authUser.uid);
  return admin.auth().setCustomUserClaims(authUser.uid, {
    level: data.level,
    offlineEnabled: data.offlineEnabled,
    enabled: data.enabled
  });
};


exports.createdCategory = functions.database.ref("/categorie/{uid").onUpdate((data, context) => {
  console.log("triggered")
  const cloud = new CloudFunctions;
  cloud.toBeSynchronized(Operations.created, "categories", data.after.key, context);
});

// set user's role
exports.triggerUsers = functions.database.ref("/userProfile").onWrite(event => {
  getUpdatedUser(event).forEach(user => {
    const userData = event.after.val()[user];
    const claims = {
      email: userData.email,
      level: userData.level,
      offlineEnabled: userData.offlineEnabled,
      enabled: userData.enabled
    };
    // tslint:disable-next-line: no-floating-promises
    setClaims(claims)
      .then(() => {
        console.log("setted claims for ", userData.key);
        console.log("seted claims", claims);
      })
      .catch(err => {
        console.log("error", err);
      });
  });
});


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
