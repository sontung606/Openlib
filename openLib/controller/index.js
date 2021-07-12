const moment = require('moment');
const Book = require('../models/book');
exports.getIndex = (req, res, next) => {
    Book.find()
      .then( (books) => {
        if(req.session.accountData)
        {
          const accountData= req.session.accountData;
          res.render('index/indexBook', {
            booksData: books,
            accountData:accountData,
            moment:moment,
            path: '/'
          });        
        }
        else{
          res.render('index/indexBook', {
            booksData: books,
            moment:moment,
            path: '/'
          });   
        }     
      })
      .catch(err => {
        console.log(err);
      });
  };
  