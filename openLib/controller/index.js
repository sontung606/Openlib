const moment = require('moment');
const Book = require('../models/book');
exports.getIndex = async (req, res, next) => {
  const bookCategories = await Book.find().distinct('categories');
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
};
