var firebase = require("firebase-admin");
var serviceAccount = require("./ncue-web-wordle-project-firebase-adminsdk-m478c-df3004c9aa.json");
// Get a reference to the database service
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://ncue-web-wordle-project-default-rtdb.firebaseio.com"
});
var firebaseDB = firebase.database();
//var firebaseDB = firebase.database()
firebaseDB.ref("theText").set("caught string")

 
module.exports = firebase;