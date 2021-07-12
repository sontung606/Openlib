const Account = require('../models/account');
const BookOrders = require('../models/bookOrder');

exports.getCustomer = (req, res, next) => {
    const accountUser = req.session.accountData;
    const date = new Date(accountUser).toLocaleDateString('en-CA');
    res.render('customer/customerPage', {
        accountUser: accountUser,
        date: date
    });
};


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