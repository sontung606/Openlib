const Account = require('../models/account');
const BookOrders = require('../models/bookOrder');
const BookBorrow = require('../models/booksBorrow');
const { populate } = require('../models/book');
const Book = require('../models/book');
const moment = require('moment');

// user change info
exports.getCustomer = (req, res, next) => {
    const accountUser = req.session.accountData;
    const date = new Date(accountUser.birthday).toLocaleDateString('en-CA');
    res.render('customer/customerPage', {
        accountUser: accountUser,
        date: date
    });
};
exports.patchCustomerInfo = (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    Account.findByIdAndUpdate({_id: id}, data).then((account) => {
        res.render('customer/customerPage'),{
            _id: id,
            email: data.email,
            firstname: data.first,
            lastname: data.last,
            phoneNum: data.phone,
            birthday: data.date,    
            success: "Update info successfully!"
        };
    })
}

exports.getBookBorrow = (req, res, next) => {
    const userId = req.session.accountData._id;
    BookBorrow.find({accountId: userId})
        .populate('bookId').then(result => {
        res.render('customer/customerBorrowed',{
            data: result,
            moment: moment
        })
        console.log(result)
    })
}


// user order book
exports.getBookOrder = (req, res, next) => {
    const date = new Date().toLocaleDateString('en-CA');
    res.render('customer/customerOrder', {
        email: req.session.accountData.email,
        date: date,
        success: ''
    });
};

exports.postBookOrders = (req, res, next) => {
    const order = new BookOrders({
        accountMail : req.body.usermail,
        orderDate : req.body.date,
        bookName : req.body.bookname,
        bookAuthor : req.body.author
    });
    order.save().then(() => {
        res.render('customer/customerOrder',{
            email: req.body.usermail,
            date: req.body.date,
            success: "Order successfully!"
        })
    }).catch((err) => {
        res.render('customer/customerOrder', {
            error: err,
            email: req.body.usermail,
            date: req.body.date,
        });
    });
}