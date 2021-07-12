module.exports=(req,res,next)=>{
    if(req.session.accountData){
        next()

    }
    else{
        res.redirect('/login');
    }
}