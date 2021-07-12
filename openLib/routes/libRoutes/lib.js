const express = require('express');
const router = express.Router();
const index = require('../../controller/index');

router.get('/', index.getIndex);


module.exports = router;