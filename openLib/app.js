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
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const isadmin = require('./middleware/is-admin');



app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', 
  cookie: { maxAge: 60000 }}));
app.use(function(req, res, next) {
    res.locals.accountDataNav = req.session.accountData;
    next();
});
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(lib);
app.use(account);
app.use(book);
app.use(isadmin,admin);
app.use(customer);
// app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://tung:tung@cluster0.n5p01.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });