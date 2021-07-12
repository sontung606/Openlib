const express = require('express');
const router = express.Router();
const customer = require('../../controller/customer')
const isLogin = require('../../middleware/is-login');

router.get('/customer',isLogin, customer.getCustomer);

module.exports = router;