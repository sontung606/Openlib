const Account = require('../models/account');
const Book = require('../models/book');
const BookOrder = require('../models/bookOrder');
const moment = require('moment');


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
exports.getAddBook = (req, res, next) => {
    res.render('admin/bookinsert');
};
exports.postAddBook = (req, res, next) => {
    const titleInput = req.body.title;
    const authorInput = req.body.author;
    const ratingInput = req.body.rating;
    const descriptionInput = req.body.description;
    const published_dateInput = req.body.published_date;
    const imageUrlInput = req.body.imageUrl;
    const categoriesInput = req.body.categories;
    const book = new Book({ title: titleInput, author: authorInput, rating: ratingInput, description: descriptionInput, published_date: published_dateInput, imageUrl: imageUrlInput, categories: categoriesInput });
    book.save()
    res.redirect('/admin/add-book')
};
exports.getDeleteBook = (req, res, next) => {
    const id = req.params.Id;
    Book.findByIdAndDelete({ _id: id }).then(result => {
        res.redirect('/admin/showAllBook');
    });
}
exports.getUpdateBook = (req, res, next) => {
    const id = req.params.Id;
    Book.findOne({ _id: id }).then(result => {
        const date = new Date(result.published_date).toLocaleDateString('en-CA');
        res.render('admin/bookUpdate', {
            BookData: result,
            date:date
        })
    })
}
exports.patchUpdateBook = (req, res, next) => {
    const id = req.params.Id;
    const data = req.body;
    Book.findOneAndUpdate({ _id: id }, data).then(result => {
        res.redirect('/admin/showAllBook');
    })
}
exports.getUpdateAccount = (req, res, next) => {
    const id = req.params.Id;
    Account.findOne({ _id: id }).then(result => {
        const date = new Date(result.birthday).toLocaleDateString('en-CA');
        res.render('admin/accountUpdate', {
            accountData: result,
            date:date
        })
    })
}
exports.postUpdateAccount = (req, res, next) => {
    const id = req.params.Id;
    const data = req.body;
    Account.findOneAndUpdate({ _id: id }, data).then(result => {
        res.redirect('/admin/showaccount');
    })
}
exports.getCreateAccount = (req, res, next) => {
    res.render('admin/accountCreate');
}
exports.postCreateAccount = (req, res, next) => {
    const emailInput = req.body.email;
    const passInput = req.body.pass;
    const firstnameInput = req.body.firstname;
    const lastnameInput = req.body.lastname;
    const birthdayInput = req.body.birthday;
    const phoneInput = req.body.phoneNum;
    const authorityInput = req.body.authority;
    const enabledInput = req.body.enabled;
    const account = new Account({
        email: emailInput,
        password: passInput,
        firstname:firstnameInput,
        lastname:lastnameInput,
        birthday:birthdayInput,
        phoneNum: phoneInput,
        authority: authorityInput,
        enabled: enabledInput
    });
    account.save()
        .catch(err => {
            res.render('admin/accountCreate', {
                error: err
            })
        })
        .then(result => {
            res.render('admin/accountCreate', {
                modal: "success"
            })
        });
}
exports.getDeleteAccount = (req, res, next) => {
    const id = req.params.Id;
    Account.findByIdAndDelete({ _id: id }).then(() => {
        res.redirect('/admin/showaccount');
    })
}

exports.getAllRequest = (req, res, next) => {
    BookOrder.find().then(result => {
        res.render('admin/showAllRequest', {
            bookOrder : result,
            moment: moment
        })
    })
}