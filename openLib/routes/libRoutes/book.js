const express = require('express');
const router = express.Router();
const book = require('../../controller/book');
const isLogin = require('../../middleware/is-login')

router.get('/book-details/:bookID',book.getbook);
router.get('/book-borrow/:bookID',isLogin,book.getBookBorrow);
router.get('/book-categories/:categories',book.getbookcate);
router.post('/book-borrow',isLogin,book.postBookBorrow);
router.post('/book-RAC',isLogin,book.postRAC);

module.exports=router;