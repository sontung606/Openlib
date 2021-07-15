const session = require('express-session');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const lib = require('./routes/libRoutes/lib');
const account = require('./routes/libRoutes/account');
const book = require('./routes/libRoutes/book');
const admin = require('./routes/admin/admin');
const customer = require('./routes/customer/customer');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const BookBorrow = require('./models/booksBorrow');
const Account = require('./models/account');




app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', 
  cookie: { maxAge: 600000 }}));
app.use(function(req, res, next) {
    res.locals.accountDataNav = req.session.accountData;
    next();
});
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(lib);
app.use(account);
app.use(book);
app.use(admin);
app.use(customer);
// app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://tung:tung@cluster0.n5p01.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}
  )
  .then(result => {
    setInterval(function(){
    BookBorrow.find()
    .then(result=>{
      for(books of result){
        if(Date.parse(books.dateReturn)< Date.now()){
          console.log(Date.now())
          let dateBanned = new Date(Date.now()+(Date.now()-Date.parse(books.dateReturn)));
          Account.findOneAndUpdate({_id:books.accountId},{banned:dateBanned}).then(
         );
        }
      }
    })
    .catch(err=>{
      console.log(err)
    })
    },86400000);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });