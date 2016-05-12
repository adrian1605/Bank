/**
 * Created by Adrian on 4/10/2016.
 */
'use strict';

var express = require('express');
var router = express.Router();
var db = require('../db');
const adminController = require('../controllers/admin');

router.get('/', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('login');
    }
    res.render('dashboard', { title: 'Dashboard' });
});

router.get('/employee_list', adminController.getEmployeeList);

router.get('/employee', adminController.getEmployee);

router.put('/employee', adminController.updateEmployee);

router.post('/employee', adminController.createEmployee);

router.delete('/employee/:id', adminController.deleteEmployee);

router.get('/employee/report/:id', adminController.getEmployeeReport);

module.exports = router;
