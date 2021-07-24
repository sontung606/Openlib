const Account = require('../models/account');
const BookOrders = require('../models/bookOrder');
const BookBorrow = require('../models/booksBorrow');
const { populate } = require('../models/book');
const Book = require('../models/book');
const moment = require('moment');


exports.getStaffPage = (req, res, next) => {
    const accountUser = req.session.accountData;
    const date = new Date(accountUser.birthday).toLocaleDateString('en-CA');
    res.render('staff/staffPage', {
        accountUser: accountUser,
        date: date
    });
}
exports.getBookBorrows = (req, res, next) => {
    BookBorrow.find()
    .populate('accountId')
    .populate('bookId')
    .then(result=>{
        res.render('staff/staffListBookBorrow', {
            BookBorrow: result,
            moment:moment
        });
    })
  
}
exports.getConfirmBorrows = (req, res, next) => {
    const Id = req.params.Id;
    BookBorrow.findOneAndUpdate({_id:Id},{
        status:true
    })
    .then(result=>{
        res.redirect('/staff-bookBorrow');
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.postStaffBorrowForCustomer = (req, res, next) => {
    
}