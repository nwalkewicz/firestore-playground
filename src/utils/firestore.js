const path = require('path');

const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore} = require('firebase-admin/firestore');

let serviceAccount;
try {
	serviceAccount = process.env.FIRESTORE_KEY || require(path.join(__dirname, '../../private/firestore-key.json'));
} catch(err) {
	console.error(`Couldn't load Firestore key. Found error: `, err);
}

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = {db};
