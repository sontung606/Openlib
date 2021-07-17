const moment = require('moment');
const Book = require('../models/book');
exports.getIndex = (req, res, next) => {
  let bookCategories ;
    Book.find().distinct('categories',function(err,result)  {
      bookCategories=result;
    });

    Book.find()
      .then((books) => {
       
          res.render('index/indexBook', {
            booksData: books,
            moment:moment,
            bookCategories:bookCategories,
            path: '/'
          });     
      })
      .catch(err => {
        console.log(err);
      });
  };
  