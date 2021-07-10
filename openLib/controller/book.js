const Book = require('../models/book');
var moment = require('moment');

exports.getbook = (req, res, next) => {
  const bookID = req.params.bookID;
  Book.findById(bookID)
    .then(book => {
      res.render('books/bookdetail', {
        bookData: book,
        moment: moment
      })
    })
}
