/**
 * Created by Adrian on 4/6/2016.
 */
'use strict';

var express = require('express');
var router = express.Router();
var db = require('../db');
var loginController = require('../controllers/login');

/* GET login page. */
router.get('/', loginController.getIndex);
router.post('/',  loginController.doLogin);

module.exports = router;
