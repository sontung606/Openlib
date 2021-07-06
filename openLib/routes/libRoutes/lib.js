const express = require('express');
const router = express.Router();
const index = require('../../controller/index');
const book = require('../../controller/book');
const account = require('../../controller/account');


router.get('/', index.getIndex);
router.get('/add-book',book.getAddBook)
router.post('/add-book',book.postAddBook)
router.get('/book/:bookID',book.getbook)
router.get('/login',account.getLogin );
router.get('/signup',account.getSignUp);
router.post('/signup',account.postSignUp);

module.exports = router;