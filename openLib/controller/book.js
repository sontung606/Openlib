const Book = require('../models/book');
const BookBorrow = require('../models/booksBorrow');
const account = require('../models/account');
var moment = require('moment');
const { populate } = require('../models/book');

exports.getbook = (req, res, next) => {
  const bookID = req.params.bookID;
  Book.findById(bookID)
  .populate('RAC.accountId')
    .then(book => {
      let sao =0;
      for(ratingTotal of book.RAC){
         sao = sao + ratingTotal.rating;
      }
      const rating =(sao/book.RAC.length).toFixed(1);
      res.render('books/bookdetail', {
        bookData: book,
        rating:rating,
        moment: moment
      })
    })
}
exports.postRAC = (req, res, next) => {
  const id = req.body.id;
  const ratingInput = req.body.rate;
  const commentInput = req.body.comment;
  const RACInput={
    accountId:req.session.accountData._id,
    rating:ratingInput,
    comment:commentInput
  };
  Book.findOne({_id:id}).then((result)=>{
  result.RAC.push(RACInput);
   Book.updateOne({_id:id},{RAC:result.RAC}).then(()=>{
    res.redirect('/book-details/'+id);
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

