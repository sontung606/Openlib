const express = require('express');
const router = express.Router();
const index = require('../../controller/index')


router.get('/', index.getIndex);

router.get('/add-book',index.getAppBook)
router.post('/add-book',index.postAppBook)

module.exports = router;