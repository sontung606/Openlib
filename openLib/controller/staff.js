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
    const date = new Date();
    BookBorrow.find()
        .populate('accountId')
        .populate('bookId')
        .then(result => {
            res.render('staff/staffListBookBorrow', {
                BookBorrow: result,
                moment: moment,
                Date: date
            });
        })
}
exports.getConfirmBorrows = (req, res, next) => {
    const Id = req.params.Id;
    BookBorrow.findOneAndUpdate({ _id: Id }, {
        status: true
    })
        .then(result => {
            res.redirect('/staff-bookBorrow');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getConfirmReturn = async (req, res, next) => {
    const Id = req.params.Id;
    const date = new Date();

    const bookBorrowFind = await BookBorrow.findById(Id).populate('bookId');
    const borrowDate = bookBorrowFind.dateBorrow;
    let rentDay = date.getDate() - borrowDate.getDate();
    console.log(rentDay);
    const rentTotal = rentDay*((bookBorrowFind.bookId.bookPriceBorrow * 1)/100);
    BookBorrow.findOneAndUpdate({ _id: Id}, {
        status: false,
        dateReturn:date,
        rentPriceTotal:rentTotal
    })
    .then(result => {
        res.redirect('/staff-bookBorrow');
    })
    .catch(err => {
        console.log(err);
    })
}
exports.getCancelBorrow = (req, res, next) => {
    const Id = req.params.Id;
    BookBorrow.findByIdAndDelete({ _id: Id })
        .then(result => {
            res.redirect('/staff-bookBorrow');
        })
        .catch(err => {
            console.log(err);
        })
}