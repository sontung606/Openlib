const Book = require('../models/book');
const BookBorrow = require('../models/booksBorrow');
const account = require('../models/account');
var moment = require('moment');
const { populate } = require('../models/book');

const ITEMS_PER_PAGE = 4;

exports.getBookSearch =async (req, res, next) => {
  const page = parseInt(req.query.page);
  const search = req.query.search;
  const cate = req.query.cate;
  const url = req.url;
  let numItem ;
  if(search==null|| cate ==null){
    Book.find()
    .distinct('categories', function (err, result) {
      let bookCategories = result;
        res.render('books/bookCategories',{
        bookData:null,
        bookCategories:bookCategories
      })
    });
  }
  else if(cate!='All'){
    Book.find({$or:
      [{title: { '$regex' : search, '$options' : 'i' }},
     {author:{ '$regex' : search, '$options' : 'i' }},]})
     .and({categories:cate})
     .countDocuments()
     .then(numBooks=>{
      numItem=numBooks;
      return  Book.find({$or:
        [{title: { '$regex' : search, '$options' : 'i' }},
       {author:{ '$regex' : search, '$options' : 'i' }},]})
       .and({categories:cate})
       .skip((page-1)*ITEMS_PER_PAGE)
       .limit(ITEMS_PER_PAGE)
     })
     .then(books=>{
      Book.find().distinct('categories', function (err, result) {
       let bookCategories = result;
       res.render('books/bookCategories',{
         bookData:books,
         bookCategories:bookCategories,
         totalBooks:numItem,
         hasNextPage :ITEMS_PER_PAGE*page<numItem,
         hasPreviousPage:page>1,
         firstPage:1,
         nextPage: page+1 ,
         currentPage:page, 
         previousPage:page-1,
         lastPage:Math.ceil( numItem/ITEMS_PER_PAGE),
         url:url
       })
     }); 
   })
  }
  else{
    Book.find({$or:
      [{title: { '$regex' : search, '$options' : 'i' }},
     {author:{ '$regex' : search, '$options' : 'i' }},]})
     .countDocuments()
     .then(numBooks=>{
      numItem=numBooks;
      return  Book.find({$or:
        [{title: { '$regex' : search, '$options' : 'i' }},
       {author:{ '$regex' : search, '$options' : 'i' }},]})
       .skip((page-1)*ITEMS_PER_PAGE)
       .limit(ITEMS_PER_PAGE)
     })
     .then(books=>{
      Book.find().distinct('categories', function (err, result) {
       let bookCategories = result;
       res.render('books/bookCategories',{
         bookData:books,
         bookCategories:bookCategories,
         totalBooks:numItem,
         hasNextPage :ITEMS_PER_PAGE*page<numItem,
         hasPreviousPage:page>1,
         firstPage:1,
         nextPage: page+1 ,
         currentPage:page, 
         previousPage:page-1,
         lastPage:Math.ceil( numItem/ITEMS_PER_PAGE),
         url:url
       })
     }); 
   })
  }
}

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
exports.getRACDelete=(req,res,next)=>{
  const RACId= req.params.bookRACID;
  const bookId= req.params.bookID;
  Book.findById(bookId).then(book=>{
    for(let i = 0; i<book.RAC.length;i++){
      if(book.RAC[i]._id== RACId){
        book.RAC.splice(i,1);
        break;
      }
    }
    Book.findByIdAndUpdate({_id:bookId},book).then(()=>{
      res.redirect('/book-details/'+bookId);
    });
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

