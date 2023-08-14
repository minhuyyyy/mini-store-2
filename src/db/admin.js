var admin = require("firebase-admin");

var serviceAccount = require("../shared/lunar-parsec-392805-firebase-adminsdk-ft7st-9edebf31c6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
