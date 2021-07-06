
const Account = require('../models/account');
exports.getLogin=(req,res,next)=>{
    res.render('index/login');
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