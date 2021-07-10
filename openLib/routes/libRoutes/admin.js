const express = require('express');
const router = express.Router();
const admin = require('../../controller/admin')

router.get('/admin', admin.getAdmin);
router.get('/admin/showaccount', admin.getAllAccount);

module.exports = router;    