const express = require('express');
const router = express.Router();
const admin = require('../../controller/admin');
const book = require('../../models/book');
const isAdmin =require('../../middleware/is-admin');


router.get('/admin', isAdmin, admin.getAdmin);
router.get('/admin/showaccount',isAdmin, admin.getAllAccount);
router.get('/admin/showAllBook',isAdmin, admin.getAllBook);
router.get('/admin/add-book',isAdmin, admin.getAddBook);
router.post('/admin/add-book',isAdmin,admin.postAddBook);
router.get('/admin/delete-book/:Id',isAdmin,admin.getDeleteBook);
router.get('/admin/update-book/:Id',isAdmin,admin.getUpdateBook);
router.patch('/admin/update-book/:Id',isAdmin,admin.patchUpdateBook);
router.get('/admin/create-account',isAdmin,admin.getCreateAccount);
router.post('/admin/create-account',isAdmin,admin.postCreateAccount);
router.get('/admin/update-account/:Id',isAdmin,admin.getUpdateAccount);
router.post('/admin/update-account/:Id',isAdmin,admin.postUpdateAccount);
router.get('/admin/detele-account/:Id',isAdmin,admin.getDeleteAccount);


module.exports = router;    