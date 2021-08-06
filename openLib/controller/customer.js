const Account = require('../models/account');
const BookOrders = require('../models/bookOrder');
const BookBorrow = require('../models/booksBorrow');
const { populate } = require('../models/book');
const Book = require('../models/book');
const moment = require('moment');
const bcrypt = require('bcrypt');


// user change info
exports.getCustomer = (req, res, next) => {
    const accountUser = req.session.accountData;
    const date = new Date(accountUser.birthday).toLocaleDateString('en-CA');
    res.render('customer/customerPage', {
        accountUser: accountUser,
        date: date
    });
};
exports.postUpdateCustomerInfo = (req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    if (req.body.crtpassword === "" && req.body.newpassword === "") {
        Account.findByIdAndUpdate({ _id: id }, data).then((account) => {
            res.redirect('/logout');
        })
    }
    else {
        if (bcrypt.compareSync(req.body.crtpassword, req.session.accountData.password)) {
            const saltRounds = 10;
            const hashPass = bcrypt.hashSync(req.body.newpassword, saltRounds);
            Account.findByIdAndUpdate({ _id: id }, {
                firstname: data.firstname,
                lastname: data.lastname,
                phoneNum: data.phoneNum,
                birthday: data.birthday,
                password: hashPass
            }).then((account) => {
                res.redirect('/logout');
            })
        }
        else {
            const accountUser = req.session.accountData;
            const date = new Date(accountUser.birthday).toLocaleDateString('en-CA');
            res.render('customer/customerPage', {
                accountUser: accountUser,
                date: date,
                err: "Wrong password"
            });
        }
    }

}

// exports.postUpdateCustomerPassword = (req, res, next) => {
//     const accountUser = req.session.accountData;
//     const id = req.params.id;
//     const cpw = req.body.crtpassword;
//     const npw = req.body.newpassword;
//     // const cfpw = req.body.confirm;
//     Account.findByIdAndUpdate({ _id: id }, {password : npw}).then(result => {
//         if(cpw === accountUser.password){
//             res.redirect('/logout')
//         }else{
//             return res.render('customer/customerPage', {
//                 success: false
//             });
//         }
//     })
// }

exports.getBookBorrow = (req, res, next) => {
    const userId = req.session.accountData._id;
    BookBorrow.find({ accountId: userId })
        .populate('bookId').then(result => {
            res.render('customer/customerBorrowed', {
                data: result,
                moment: moment,
                success: ''
            })
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
        accountMail: req.body.usermail,
        orderDate: req.body.date,
        bookName: req.body.bookname,
        bookAuthor: req.body.author
    });
    order.save().then(() => {
        res.render('customer/customerOrder', {
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