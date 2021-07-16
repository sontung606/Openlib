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
      let sao = 0;
      for (ratingTotal of book.RAC) {
        sao = sao + ratingTotal.rating;
      }
      const rating = (sao / book.RAC.length).toFixed(1);
      res.render('books/bookdetail', {
        bookData: book,
        rating: rating,
        moment: moment
      })
    })
}
exports.getbookcate = (req, res, next) => {
  const categories = req.params.categories;
  Book.find({categories:categories}).then(result=>{
    res.render('books/bookCategories',{
      bookData:result,
      categories:categories
    })
  })
}

exports.postRAC = (req, res, next) => {
  const id = req.body.id;
  const ratingInput = req.body.rate;
  const commentInput = req.body.comment;
  const RACInput = {
    accountId: req.session.accountData._id,
    rating: ratingInput,
    comment: commentInput
  };
  Book.findOne({ _id: id }).then((result) => {
    result.RAC.push(RACInput);
    Book.updateOne({ _id: id }, { RAC: result.RAC }).then(() => {
      res.redirect('/book-details/' + id);
    })
  })
}


exports.getBookBorrow = (req, res, next) => {
  const bookID = req.params.bookID;
  Book.findById(bookID)
    .then(book => {
      let sao = 0;
      for (ratingTotal of book.RAC) {
        sao = sao + ratingTotal.rating;
      }
      const rating = (sao / book.RAC.length).toFixed(1);
      res.render('books/bookBorrow', {
        bookData: book,
        rating:rating,
        moment: moment
      })
    })
}


exports.postBookBorrow = (req, res, next) => {
  const dateBorrowInput = Date.parse(req.body.dateBorrow);
  const numMonth = parseInt(req.body.dateReturn);
  const bookIdInput = req.body.bookId;
  const dateReturnInput = new Date(dateBorrowInput + numMonth);

  if (numMonth == 0 && req.session.accountData.authority == "Lecturers") {
    BookBorrow.find({ accountId: req.session.accountData._id }).then(result => {
      if (result.length >= 5) {
        Book.findById(bookIdInput).then((result) => {
          let sao = 0;
          for (ratingTotal of result.RAC) {
            sao = sao + ratingTotal.rating;
          }
          const rating = (sao / result.RAC.length).toFixed(1);
          res.render('books/bookBorrow', {
            bookData: result,
            rating:rating,
            moment: moment,
            error: "You've reached your limit, you can no longer borrow more than 5 books."
          })
        })  
      }
      else {
        const BookBorrowNew = new BookBorrow({
          dateBorrow: dateBorrowInput,
          accountId:  req.session.accountData,
          bookId: bookIdInput
        });
        BookBorrowNew.save()
          .then(() => {
            Book.findById(bookIdInput).then((result) => {
              let sao = 0;
              for (ratingTotal of result.RAC) {
                sao = sao + ratingTotal.rating;
              }
              const rating = (sao / result.RAC.length).toFixed(1);
              res.render('books/bookBorrow', {
                bookData: result,
                moment: moment,
                rating:rating,
                success: "Borrow book sucessful"
              })
            })
          })
          .catch((err) => {
            let sao = 0;
            for (ratingTotal of result.RAC) {
              sao = sao + ratingTotal.rating;
            }
            const rating = (sao / result.RAC.length).toFixed(1);
            Book.findById(bookIdInput).then((result) => {
              res.render('books/bookBorrow', {
                bookData: result,
                rating:rating,
                moment: moment,
                error: "Error please input correct information !!!"
              })
            })
          })
      }
    })
  }
  else {
    BookBorrow.find({ accountId: req.session.accountData._id }).then(result => {
      if (result.length >= 3) {
        Book.findById(bookIdInput).then((result) => {
          let sao = 0;
          for (ratingTotal of result.RAC) {
            sao = sao + ratingTotal.rating;
          }
          const rating = (sao / result.RAC.length).toFixed(1);
          res.render('books/bookBorrow', {
            bookData: result,
            rating:rating,
            moment: moment,
            error: "You've reached your limit, you can no longer borrow more than 3 books."
          })
        })  
      }
      else {
        const BookBorrowNew = new BookBorrow({
          dateBorrow: dateBorrowInput,
          dateReturn: dateReturnInput,
          accountId:  req.session.accountData,
          bookId: bookIdInput
        });
        BookBorrowNew.save()
          .then(() => {
            Book.findById(bookIdInput).then((result) => {
              let sao = 0;
          for (ratingTotal of result.RAC) {
            sao = sao + ratingTotal.rating;
          }
          const rating = (sao / result.RAC.length).toFixed(1);
              res.render('books/bookBorrow', {
                bookData: result,
                rating:rating,
                moment: moment,
                success: "Borrow book sucessful"
              })
            })
          })
          .catch((err) => {
            Book.findById(bookIdInput).then((result) => {
              let sao = 0;
              for (ratingTotal of result.RAC) {
                sao = sao + ratingTotal.rating;
              }
              const rating = (sao / result.RAC.length).toFixed(1);
              res.render('books/bookBorrow', {
                bookData: result,
                rating:rating,
                moment: moment,
                error: "Error please input correct information !!!"
              })
            })
          })
      }
    })
  }
}


