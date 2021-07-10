const Account = require('../models/account');

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