const express = require('express');
const router = express.Router();
const book = require('../../controller/book');

router.get('/book-details/:bookID',book.getbook)

module.exports=router;