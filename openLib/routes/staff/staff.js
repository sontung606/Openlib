const express = require('express');
const router = express.Router();
const staff = require('../../controller/staff');
const book = require('../../models/book');
const isLogin = require('../../middleware/is-login');


router.get('/staff', isLogin, staff.getStaffPage);
router.get('/staff-bookBorrow',isLogin,staff.getBookBorrows);
router.get('/staff-confirmBorrow/:Id',isLogin,staff.getConfirmBorrows)
module.exports = router;