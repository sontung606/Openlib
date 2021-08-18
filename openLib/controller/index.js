const moment = require('moment');
const Book = require('../models/book');
const bookBorrow = require('../models/booksBorrow');

exports.getIndex = async (req, res, next) => {
  const bookCategories = await Book.find().distinct('categories');
  const books = await Book.find();
  const trendBooks = await bookBorrow.aggregate([
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
  res.render('index/indexBook', {
    bookCategories: bookCategories,
    trendBooks:trendBooks,
    booksData: books,
    bookTitleData:autocorrectSeachArray,
    moment: moment,
    path: '/'
  });
};
