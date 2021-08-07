const Account = require('../models/account');
const Book = require('../models/book');
const BookOrder = require('../models/bookOrder');
const moment = require('moment');
const bcrypt = require('bcrypt');
const Authorities = require('../models/authorities')


exports.getAdmin = (req, res, next) => {
    res.render('admin/adminpage');
};

exports.getAllAccount = (req, res, next) => {
    Account.find().populate('authority').then(result => {
        res.render('admin/showAllAccount', {
            accountData: result
        });
    })
};

exports.getAllBook = (req, res, next) => {
    Book.find().then(result => {
        res.render('admin/showAllBook', {
            bookData: result,
            moment: moment
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
    const imageUrlInput = req.file.path;
    const categoriesInput = req.body.categories;
    const book = new Book({ title: titleInput, author: authorInput, rating: ratingInput, description: descriptionInput, published_date: published_dateInput, imageUrl: imageUrlInput, categories: categoriesInput });
    book.save().then(() => {
        res.redirect('/admin/add-book')
    })
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
            date: date
        })
    })
}
exports.patchUpdateBook = (req, res, next) => {
    const id = req.params.Id;
    const data = req.body;
    const imageUrlInput = req.file.path;
    data.imageUrl = imageUrlInput;
    Book.findOneAndUpdate({ _id: id }, data).then(result => {
        res.redirect('/admin/showAllBook');
    })
}
exports.getUpdateAccount = async (req, res, next) => {
    const id = req.params.Id;
    let authList = await Authorities.find()
    Account.findOne({ _id: id }).then(result => {
        const date = new Date(result.birthday).toLocaleDateString('en-CA');
        res.render('admin/accountUpdate', {
            accountData: result,
            authList: authList,
            date: date
        })
    })
}
exports.postUpdateAccount = (req, res, next) => {
    const id = req.params.Id;
    const data = req.body;
    if (data.password === "" || data.password == null) {
        delete data.password;
        Account.findOneAndUpdate({ _id: id }, data).then(result => {
            res.redirect('/admin/showaccount');
        })
    }
    else {
        const saltRounds = 10;
        const hashPass = bcrypt.hashSync(data.password, saltRounds);
        data.password = hashPass;
        Account.findOneAndUpdate({ _id: id }, data).then(result => {
            res.redirect('/admin/showaccount');
        })
    }

}
exports.getCreateAccount = (req, res, next) => {
    Authorities.find().then((auth) => {
        res.render('admin/accountCreate', {
            authList: auth
        });
    })
}
exports.postCreateAccount = (req, res, next) => {
    const saltRounds = 10;
    const emailInput = req.body.email;
    const passInput = req.body.password;
    const firstnameInput = req.body.firstname;
    const lastnameInput = req.body.lastname;
    const birthdayInput = req.body.birthday;
    const phoneInput = req.body.phoneNum;
    const authorityInput = req.body.authority;
    const enabledInput = req.body.enabled;
    const hashPass = bcrypt.hashSync(passInput, saltRounds);
    const account = new Account({
        email: emailInput,
        password: hashPass,
        firstname: firstnameInput,
        lastname: lastnameInput,
        birthday: birthdayInput,
        phoneNum: phoneInput,
        authority: authorityInput,
        enabled: enabledInput
    });
    account.save()
        .catch(err => {
            Authorities.find().then((result) => {
                res.render('admin/accountCreate', {
                    error: err,
                    authList: result
                })
            })
        })
        .then(result => {
            Authorities.find().then((result) => {
                res.render('admin/accountCreate', {
                    modal: "success",
                    authList: result
                })
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
            bookOrder: result,
            moment: moment
        })
    })
}

exports.getDashboard = (req, res, next) => {
    res.render('admin/testChart')
}

exports.getAuth = (req, res, next) => {
    Authorities.find().then((result) => {
        res.render('admin/showAllAuth', {
            authList: result
        });
    })
};

exports.getCreateAuth = (req, res, next) => {
    res.render('admin/authorityCreate');
};

exports.getDeteleAuth = (req, res, next) => {
    const Id = req.params.Id;
    Authorities.findByIdAndDelete(Id).then(() => {
        res.redirect('/admin/showAllAuth');
    })
};

exports.postAddAuth = (req, res, next) => {
    const data = req.body;
    const auth = new Authorities(data);
    auth.save().then(
        res.render('admin/authorityCreate', {
            modal: "success"
        })
    )
};
exports.getUpdateAuth = (req, res, next) => {
    const id = req.params.Id;
    Authorities.findById(id).then(result => {
        res.render('admin/authorityUpdate', { Auth: result });

    })
};
exports.postUpdateAuth = async (req, res, next) => {
    const data = req.body;
    const id = req.params.Id;
    await Authorities.findByIdAndUpdate({ _id: id }, data)
    Authorities.findById(id).then(result => {
        res.render('admin/authorityUpdate', {
            Auth: result,
            modal: "success"
        })
    })
};
