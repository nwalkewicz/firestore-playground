const fs = require('fs');
const path = require('path');

const express = require('express');
const server = express();

const port = process.env.PORT || 3000;

server.use(require('./routers/api'));
server.use(express.static('public'));

server.listen(port, () => console.log(`Server listening on port ${port}`));
