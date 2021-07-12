const express = require('express');
const router = express.Router();
const admin = require('../../controller/admin');
const book = require('../../models/book');

router.get('/admin', admin.getAdmin);
router.get('/admin/showaccount', admin.getAllAccount);
router.get('/admin/showAllBook', admin.getAllBook);
router.get('/admin/add-book', admin.getAddBook);
router.post('/admin/add-book',admin.postAddBook);
router.get('/admin/delete-book/:Id',admin.getDeleteBook);
router.get('/admin/update-book/:Id',admin.getUpdateBook);
router.patch('/admin/update-book/:Id',admin.patchUpdateBook);
router.get('/admin/create-account',admin.getCreateAccount);
router.post('/admin/create-account',admin.postCreateAccount);
router.get('/admin/update-account/:Id',admin.getUpdateAccount);
router.post('/admin/update-account/:Id',admin.postUpdateAccount);
router.get('/admin/detele-account/:Id',admin.getDeleteAccount);


module.exports = router;    