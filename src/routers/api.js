const express = require('express');

const router = new express.Router();

router.use(require('./tasks'));

module.exports = router;
