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
    const accountUser = req.session.accountData;
    const ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    res.render('customer/customerOrder', {
        accountUser: accountUser,
        date: date + "-" + month + "-" + year
    });
};

exports.postBookOrders = async (req, res, next) => {
    const order = new BookOrders({
        accountMail : req.body.usermail,
        orderDate : req.body.date,
        bookName : req.body.bookname,
        bookAuthor : req.body.author
    });
    order = await order.save().then(() => {
        return res.render('customer/customerOrder')
    }).catch((err) => {
        return res.render('customer/customerOrder', {
            error: err
        });
    });
}