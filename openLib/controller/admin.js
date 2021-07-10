const Account = require('../models/account');
const Book = require('../models/book');


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

exports.getAllBook = (req, res, next) => {
    Book.find().then(result => {
        res.render('admin/showAllBook', {
            bookData: result
        });
    })
}
exports.getAddBook = (req, res, next) => {
    res.render('admin/bookinsert');
  };
exports.postAddBook = (req, res, next) => {
    const titleInput = req.body.title;
    const authorInput = req.body.author;
    const ratingInput = req.body.rating;
    const descriptionInput = req.body.description;
    const published_dateInput = req.body.published_date;
    const imageUrlInput = req.body.imageUrl;
    const book = new Book({ title: titleInput, author: authorInput, rating: ratingInput, description: descriptionInput, published_date: published_dateInput, imageUrl: imageUrlInput });
    book.save()
    res.redirect('/admin/add-book')
  };
exports.getDeleteBook = (req,res,next) =>{
    const id =req.params.Id;
    Book.findByIdAndDelete({_id:id}).then(result=>{
        res.redirect('/admin/showAllBook');
    });
}
exports.getUpdateBook=(req,res,next)=>{
    const id =req.params.Id;
    Book.findOne({_id:id}).then(result=>{
        res.render('admin/bookUpdate',{
            BookData:result
        })
    })
}
exports.patchUpdateBook=(req,res,next)=>{
    const id =req.params.Id;
    const data = req.body;
    Book.findOneAndUpdate({_id:id},data).then(result=>{
        res.redirect('/admin/showAllBook');
    })
}
