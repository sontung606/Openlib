const express = require('express');
const router = express.Router();
const customer = require('../../controller/customer')
const isLogin = require('../../middleware/is-login');

router.get('/customer',isLogin, customer.getCustomer);
router.get('/customer-order', isLogin,customer.getBookOrder);
router.post('/customer-order/order', isLogin,customer.postBookOrders);
router.put('/customer/update/:id', isLogin, customer.patchCustomerInfo);

module.exports = router;