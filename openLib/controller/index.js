const moment = require('moment');
exports.getIndex = (req, res, next) => {
    Book.find()
      .then( (books) => {
        res.render('index/indexBook', {
          booksData: books,
          moment:moment,
          path: '/'
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  