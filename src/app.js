const fs = require('fs');
const path = require('path');

const express = require('express');
const server = express();

const port = process.env.PORT || 3000;

let fskey;
try {
	fskey = process.env.FIRESTORE_KEY || require(path.join(__dirname, '../private/firestore-key.json'));
} catch(err) {
	console.error(`Couldn't load Firestore key. Found error: `, err);
}

server.use(require('./routers/api'));
server.use(express.static('public'));

server.listen(port, () => console.log(`Server listening on port ${port}`));
