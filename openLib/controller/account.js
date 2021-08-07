const bcrypt = require('bcrypt');
const Account = require('../models/account');
const Authorities = require('../models/authorities');
exports.getLogin = (req, res, next) => {
  res.render('index/login');
}
exports.postLogin = (req, res, next) => {
  const emailInput = req.body.email;
  const passInput = req.body.password;
  Account.findOne({ email: emailInput })
    .populate('authority')
    .then(result => {
      const date = new Date();
      if (result.length <= 0) {
        return res.render('index/login', {
          error: "Email or password is incorrect"
        })
      }
      if (bcrypt.compareSync(passInput, result.password)) {
        if (result.banned > date || result.enabled==false) {
          return res.render('index/login', {
            error: "Your account is disabled please contact to admin for more information."
          })
        }
        else {
          req.session.isLoggedIn = true;
          req.session.accountData = result;
          res.redirect('/');
        }
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
  const saltRounds = 10;
  const emailInput = req.body.email;
  const passInput = req.body.pass;
  const firstnameInput = req.body.firstname;
  const lastnameInput = req.body.lastname;
  const birthdayInput = req.body.birthday;
  const phoneInput = req.body.phoneNum;
  const enabledInput = req.body.enabled;
  const hashPass = bcrypt.hashSync(passInput, saltRounds);
  Authorities.findOne({ authority: "customer" }).then((result) => {
    const account = new Account({
      email: emailInput,
      password: hashPass,
      firstname: firstnameInput,
      lastname: lastnameInput,
      birthday: birthdayInput,
      phoneNum: phoneInput,
      authority: result._id,
      enabled: enabledInput
    });
    account.save().then(() => {
      res.render('index/signUp', {
        modal: "success"
      })
    })
  })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        res.render('index/signUp', {
          error: 'Email is already registered'
        })
      }
      let errorCustom = String(err.message).split(":");
      console.log(err);
      res.render('index/signUp', {
        error: errorCustom[2]
      })
    })
}

