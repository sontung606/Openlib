const account = require('../../controller/account');
const express = require('express');
const router = express.Router();
router.get('/login',account.getLogin);
router.post('/login',account.postLogin );
router.get('/signup',account.getSignUp);
router.post('/signup',account.postSignUp);
router.get('/logout',account.getLogOut);
module.exports = router;