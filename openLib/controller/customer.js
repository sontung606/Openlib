const Account = require('../models/account');

exports.getCustomer = (req, res, next) => {
    const accountUser = req.session.accountData;
    const date = new Date(accountUser).toLocaleDateString('en-CA');
    res.render('customer/customerPage',{
        accountUser:accountUser,
        date:date
    });
};
