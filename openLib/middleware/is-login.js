module.exports=(req,res,next)=>{
    if(req.session.accountData){
        next()
    }
    else{
        const url = req.url
        req.session.redirectTo =url;
        res.redirect('/login');
    }
}