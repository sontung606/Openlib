const Account = require('../models/account');
exports.getLogin=(req,res,next)=>{
    res.render('index/login');
  }
  exports.postLogin=(req,res,next)=>{
    const emailInput = req.body.email;
    Account.find({email:emailInput})
    .then(result=>{
      req.session.isLoggedIn=true;
      req.session.accountData=result;
      res.redirect('/');
    })
  }
  exports.getSignUp=(req,res,next)=>{
    res.render('index/signUp',{
      modal:null
    })
  }
  exports.postSignUp=(req,res,next)=>{
    const emailInput = req.body.email;
    const passInput = req.body.pass;
    const nameInput = req.body.name;
    const phoneInput = req.body.phoneNum;
    const authorityInput = req.body.authority;
    const enabledInput = req.body.enabled;
    const account = new Account({email:emailInput,password:passInput,name:nameInput,phoneNum:phoneInput,authority:authorityInput,enabled:enabledInput});
    account.save();
    console.log(account);
    res.render('index/signUp',{
      modal:"success"
    })
  }