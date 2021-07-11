const express = require('express');
const router = express.Router();
const customer = require('../../controller/customer');


router.get('/customer', customer.getCustomer);

module.exports = router;