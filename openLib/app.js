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
const staff = require('./routes/staff/staff');
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const BookBorrow = require('./models/booksBorrow');
const Account = require('./models/account');
const multer = require('multer');
const CronJob = require('node-cron')
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bobol1806@gmail.com',
    pass: 'Conmeobol'
  }
});



const fileStorage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null,'public/image')
  },
  filename:(req, file, cb)=>{
    cb(null,file.originalname);
  }
});

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true}));
app.use(multer({storage:fileStorage}).single('image'))
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
app.use('/public',express.static(path.join(__dirname,'public')));
app.use(lib);
app.use(account);
app.use(book);
app.use(admin);
app.use(customer);
app.use(staff);
app.use('/',(req,res)=>{
  res.render('404')
})

mongoose.set('useFindAndModify', false);
mongoose
  .connect(
    'mongodb+srv://tung:tung@cluster0.n5p01.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true}
  ) 
  .then(result => {
        // 00 00 12 * * 0-6
        // */01 * * * * * 
      CronJob.schedule('00 00 12 * * 0-6', function() {
      BookBorrow.find()
      .populate('accountId')
      .then(result=>{
        for(books of result){
          let today = new Date();
          if((new Date(books.dateReturn).getDate()-1)==today.getDate() && books.status == true){   
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate()+1);  
            const mailOptions = {
              from: 'bobol1806@gmail.com',
              to: 'sontung606@gmail.com',//result.accountId.email
              subject: 'OpenLib book return reminder' ,
              text: 'BookBorrowId: '+books._id + '\n Please return your library books, the last days for book return to OpenLib is ' + tomorrow.getDate() +' '+ tomorrow.getMonth() +' '+ tomorrow.getFullYear()
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            }); 
          }
          if(Date.parse(books.dateReturn)< Date.now() && books.status == true){
            let dateBanned = new Date(Date.now()+(Date.now()-Date.parse(books.dateReturn)));
            Account.findOneAndUpdate({_id:books.accountId},{banned:dateBanned}).then(result=>{
              console.log("banned "+ result.email )
            });
          }
        }
      })
      .catch(err=>{
        console.log(err)
      })
        });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });