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