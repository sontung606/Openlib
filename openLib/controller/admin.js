const Account = require('../models/account');
const Book = require('../models/book');


exports.getAdmin = (req, res, next) => {
    res.render('admin/adminpage');
};

exports.getAllAccount = (req, res, next) => {
    Account.find().then(result => {
        res.render('admin/showAllAccount', {
            accountData: result
        });
    
    })
};

exports.getAllBook = (req, res, next) => {
    Book.find().then(result => {
        res.render('admin/showAllBook', {
            bookData: result
        });
    })
}