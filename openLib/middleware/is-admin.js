module.exports=(req,res,next)=>{
    if(req.session.accountData)
    {
        if(req.session.accountData.authority.authority =="admin")
        {
            next();
        }
        else {
            res.redirect('/');
        }
    }
    else{
        const url = req.url
        req.session.redirectTo =url;
        res.redirect('/login');
    }
}