const express = require('express');
const router = express.Router();
const staff = require('../../controller/staff');
const book = require('../../models/book');
const isStaff = require('../../middleware/is-staff');


router.get('/staff', isStaff, staff.getStaffPage);
router.get('/staff-bookBorrow',isStaff,staff.getBookBorrows);
router.get('/staff-confirmBorrow/:Id',isStaff,staff.getConfirmBorrows);
router.get('/staff-confirmReturn/:Id',isStaff,staff.getConfirmReturn);
router.get('/staff-cancelBorrow/:Id',isStaff,staff.getCancelBorrow);
module.exports = router;