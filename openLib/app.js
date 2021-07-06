const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const lib = require('./routes/libRoutes/lib');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
app.use(lib);

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