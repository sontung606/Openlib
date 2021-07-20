module.exports=(req,res,next)=>{
    if(req.session.accountData)
    {
        if(req.session.accountData.authority =="staff")
        {
            next();
        }
        else {
            res.redirect('/');
        }
    }
    else{
        res.redirect('/');
    }
}