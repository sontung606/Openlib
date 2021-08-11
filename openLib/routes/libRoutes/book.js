const express = require('express');
const router = express.Router();
const book = require('../../controller/book');
const isLogin = require('../../middleware/is-login')
const isAdmin = require('../../middleware/is-admin')

router.get('/book-details/:bookID',book.getbook);
router.get('/book-borrow/:bookID',isLogin,book.getBookBorrow);
router.post('/book-borrow',isLogin,book.postBookBorrow);
router.post('/book-RAC',isLogin,book.postRAC);
router.get('/book-search',book.getBookSearch);
router.get('/RAC-Delete/:bookID/:bookRACID',isAdmin,book.getRACDelete);

module.exports=router;