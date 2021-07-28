const moment = require('moment');
const Book = require('../models/book');
exports.getIndex = (req, res, next) => {
  
  Book.find().distinct('categories', function (err, result) {
    let bookCategories = result;
    Book.find().then((books) => {
        res.render('index/indexBook', {
          bookCategories: bookCategories,
          booksData: books,
          moment: moment,
          path: '/'
        });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
