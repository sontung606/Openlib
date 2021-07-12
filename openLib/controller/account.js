const Account = require('../models/account');
exports.getLogin = (req, res, next) => {
  res.render('index/login');
}
exports.postLogin = (req, res, next) => {
  const emailInput = req.body.email;
  const passInput = req.body.password;
  Account.findOne({ email: emailInput })
    .then(result => {
      if (result.length <= 0) {
        return res.render('index/login', {
          error: "Email or password is incorrect"
        })
      }
      if (result.password === (passInput)) {
        req.session.isLoggedIn = true;
        req.session.accountData = result;
        res.redirect('/');
      }
      else {
        res.render('index/login', {
          error: "Email or password is incorrect"
        })
      }
    })
    .catch(err => {
      res.render('index/login', {
        error: "Email or password is incorrect"
      })
    })
}
exports.getLogOut = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.accountData = null;
  res.redirect('/');

}
exports.getSignUp = (req, res, next) => {
  res.render('index/signUp', {
    modal: null
  })
}
exports.postSignUp = (req, res, next) => {
  const emailInput = req.body.email;
  const passInput = req.body.pass;
  const firstnameInput= req.body.firstname;
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
  account.save().then(() => {
    res.render('index/signUp', {
      modal: "success"
    })
  })
    .catch((err) => {
      res.render('index/signUp', {
        error: err
      })
    })

}

