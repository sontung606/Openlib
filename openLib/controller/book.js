const Book = require('../models/book');
var moment = require('moment');
exports.getAddBook = (req, res, next) => {
    res.render('books/bookinsert');
  };
  exports.postAddBook = (req, res, next) => {
    const titleInput = req.body.title;
    const authorInput = req.body.author;
    const ratingInput = req.body.rating;
    const descriptionInput = req.body.description;
    const published_dateInput = req.body.published_date;
    const imageUrlInput= req.body.imageUrl;
    const book = new Book({title:titleInput,author:authorInput,rating:ratingInput,description:descriptionInput,published_date:published_dateInput,imageUrl:imageUrlInput});
    book.save()
    console.log(book);
    res.redirect('/add-book')
  };
  exports.getbook=(req,res,next)=>{
    const bookID = req.params.bookID;
    Book.findById(bookID)
    .then(book=>{
      res.render('books/bookdetail',{
        bookData:book,
        moment:moment
      })
    })
  }
  