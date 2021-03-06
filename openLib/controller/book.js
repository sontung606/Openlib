const Book = require('../models/book');
const BookBorrow = require('../models/booksBorrow');
const account = require('../models/account');
var moment = require('moment');
const { populate } = require('../models/book');
const book = require('../models/book');

const ITEMS_PER_PAGE = 8;

exports.getBookSearch = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const search = req.query.search;
  const cate = req.query.cate;
  const url = req.url;
  const trendBooks = await BookBorrow.aggregate([
    { "$group": { 
        "_id": '$bookId', 
        "count": { "$sum": 1 }
    }},
    { "$sort": { "count": -1 } },
    {
      "$lookup":{
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as:"books"
      }
    },
    { $limit : 8 }
  ]);
  const titleArray = await Book.distinct("title")
  const authorArray = await Book.distinct("author")
  const autocorrectSeachArray = titleArray.concat(authorArray);
  let numItem;
  if (search == null || cate == null) {
    Book.find()
      .distinct('categories', function (err, result) {
        let bookCategories = result;
        res.render('books/bookCategories', {
          bookData: null,
          trendBooks:trendBooks,
          bookCategories: bookCategories,
          bookTitleData:autocorrectSeachArray
        })
      });
  }
  else if (cate != 'All') {
    Book.find({
      $or:
        [{ title: { '$regex': search, '$options': 'i' } },
        { author: { '$regex': search, '$options': 'i' } },]
    })
      .and({ categories: cate })
      .countDocuments()
      .then(numBooks => {
        numItem = numBooks;
        return Book.find({
          $or:
            [{ title: { '$regex': search, '$options': 'i' } },
            { author: { '$regex': search, '$options': 'i' } },]
        })
          .and({ categories: cate })
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE)
      })
      .then(books => {
        Book.find().distinct('categories', function (err, result) {
          let bookCategories = result;
          res.render('books/bookCategories', {
            bookData: books,
            bookCategories: bookCategories,
            trendBooks:trendBooks,
            totalBooks: numItem,
            hasNextPage: ITEMS_PER_PAGE * page < numItem,
            hasPreviousPage: page > 1,
            firstPage: 1,
            nextPage: page + 1,
            currentPage: page,
            previousPage: page - 1,
            lastPage: Math.ceil(numItem / ITEMS_PER_PAGE),
            url: url,
            bookTitleData:autocorrectSeachArray
          })
        });
      })
  }
  else {
    Book.find({
      $or:
        [{ title: { '$regex': search, '$options': 'i' } },
        { author: { '$regex': search, '$options': 'i' } },]
    })
      .countDocuments()
      .then(numBooks => {
        numItem = numBooks;
        return Book.find({
          $or:
            [{ title: { '$regex': search, '$options': 'i' } },
            { author: { '$regex': search, '$options': 'i' } },]
        })
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE)
      })
      .then(books => {
        Book.find().distinct('categories', function (err, result) {
          let bookCategories = result;
          res.render('books/bookCategories', {
            bookData: books,
            bookCategories: bookCategories,
            trendBooks:trendBooks,
            totalBooks: numItem,
            hasNextPage: ITEMS_PER_PAGE * page < numItem,
            hasPreviousPage: page > 1,
            firstPage: 1,
            nextPage: page + 1,
            currentPage: page,
            previousPage: page - 1,
            lastPage: Math.ceil(numItem / ITEMS_PER_PAGE),
            url: url,
            bookTitleData:autocorrectSeachArray
          })
        });
      })
  }
}
exports.getbook = async (req, res, next) => {
  const bookID = req.params.bookID;
  let sao = 0;
  try{
    const bookFind = await Book.findById(bookID).populate('RAC.accountId');
    const sameCategoryBooks = await Book.find({_id:{$ne:bookFind._id},categories:bookFind.categories})
    const sameAuthorBook = await Book.find({_id:{$ne:bookFind._id},author:bookFind.author})
    for (ratingTotal of bookFind.RAC) {
      sao = sao + ratingTotal.rating;
    }
    const rating = (sao / bookFind.RAC.length).toFixed(1);
    res.render('books/bookdetail', {
      bookData: bookFind,
      rating: rating,
      moment: moment,
      sameAuthorBook:sameAuthorBook,
      sameCategoryBooks:sameCategoryBooks
    })
  }
  catch (err){
    res.render('404')
  }
}
exports.getRACDelete = async (req, res, next) => {
  const RACId = req.params.bookRACID;
  const bookId = req.params.bookID;
  const book = await Book.findById(bookId);
  for (let i = 0; i < book.RAC.length; i++) {  
    if(req.session.accountData._id==book.RAC[i].accountId ||req.session.accountData.authority.authority=='admin')
    {
      if (book.RAC[i]._id == RACId) {
        book.RAC.splice(i, 1);
        Book.findByIdAndUpdate({ _id: bookId }, book).then(() => {
          res.redirect('/book-details/' + bookId);
        });
        break;
      }
    }
  }
}
exports.postRACUpdate = async (req, res, next) => {
  const RACId = req.body.RACId;
  const bookId = req.body.id;
  const accountId = req.body.accountId;
  const ratingInput = req.body.rate;
  const commentInput = req.body.comment;
  const RACInput = {
    _id:RACId,
    accountId: accountId,
    rating: ratingInput,
    comment: commentInput
  };
  const book = await Book.findById(bookId);
  for (let i = 0; i < book.RAC.length; i++) {  
    if(RACId==book.RAC[i]._id)
    {
     book.RAC[i] = RACInput;
     Book.findByIdAndUpdate({ _id: bookId }, book).then(() => {
      res.redirect('/book-details/' + bookId);
    });
    break;
    }
  }
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
  Book.findOne({ _id: id })
    .then((result) => {
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
        rating: rating,
        moment: moment
      })
    })
}

exports.postBookBorrow = async (req, res, next) => {
  const dateBorrowInput = Date.parse(req.body.dateBorrow);
  const numMonth = parseInt(req.body.dateReturn);
  const bookIdInput = req.body.bookId;
  const currentDate = new Date();
  const dateReturnInput = new Date(dateBorrowInput + numMonth);
  let BookBorrowNew;
  let currentBookBorrow;
  if(req.session.accountData.authority.authority == "lecturers"){
    currentBookBorrow = await BookBorrow.find({ accountId: req.session.accountData._id,dateReturn: null }).countDocuments()
  }
  else{
     currentBookBorrow = await BookBorrow.find({ accountId: req.session.accountData._id ,dateReturn: {$gt:currentDate}}).countDocuments()
  }
  if (currentBookBorrow >= req.session.accountData.authority.numberBook) {
    Book.findById(bookIdInput).then((result) => {
      let sao = 0;
      for (ratingTotal of result.RAC) {
        sao = sao + ratingTotal.rating;
      }
      const rating = (sao / result.RAC.length).toFixed(1);
      res.render('books/bookBorrow', {
        bookData: result,
        rating: rating,
        moment: moment,
        error: "You've reached your limit, you can no longer borrow more than " + req.session.accountData.authority.numberBook + " books."
      })
    })
  }
  else {
    if (numMonth == 0 && req.session.accountData.authority.authority == "lecturers") {
      BookBorrowNew = new BookBorrow({
        dateBorrow: dateBorrowInput,
        accountId: req.session.accountData,
        bookId: bookIdInput
      });
    }
    else {
      BookBorrowNew = new BookBorrow({
        dateBorrow: dateBorrowInput,
        dateReturn: dateReturnInput,
        accountId: req.session.accountData,
        bookId: bookIdInput
      });
    }
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
            rating: rating,
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
            rating: rating,
            moment: moment,
            error: "Error please input correct information !!!"
          })
        })
      })
  }
}

