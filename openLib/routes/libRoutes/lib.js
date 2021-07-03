const express = require('express');
const router = express.Router();
const index = require('../../controller/index')


router.get('/', index.getIndex);
router.get('/add-book',index.getAddBook)
router.post('/add-book',index.postAddBook)
router.get('/book/:bookID',index.getbook)

module.exports = router;