var admin = require("firebase-admin");

var serviceAccount = require("../shared/lunar-parsec-392805-firebase-adminsdk-ft7st-d9ffe19ded.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
