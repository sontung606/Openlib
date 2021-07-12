const Book = require('../models/book');
const BookBorrow = require('../models/booksBorrow');
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
exports.getBookBorrow = (req, res, next) => {
  const bookID = req.params.bookID;

  Book.findById(bookID)
    .then(book => {
      res.render('books/bookBorrow', {
        bookData: book,
        moment: moment
      })
    })
}
exports.postBookBorrow = (req, res, next) => {
  const dateBorrowInput = Date.parse(req.body.dateBorrow);
  const numMonth = parseInt(req.body.dateReturn);
  const bookIdInput = req.body.bookId;
  const dateReturnInput = new Date(dateBorrowInput + numMonth);
  const BookBorrowNew = new BookBorrow({ 
    dateBorrow: dateBorrowInput,
    dateReturn: dateReturnInput,
    accountId: req.session.accountData, 
    bookId: bookIdInput
  });
  BookBorrowNew.save()
  .then(()=>{
    Book.findById(bookIdInput).then((result)=>{
      res.render('books/bookBorrow', {
        bookData: result,
        moment: moment,
        success:"Borrow book sucessful"
      })
    })
  })
  .catch((err)=>{
    Book.findById(bookIdInput).then((result)=>{
      res.render('books/bookBorrow', {
        bookData: result,
        moment: moment,
        error:"Error please input correct information !!!"
      })
    })
  })
  
}

