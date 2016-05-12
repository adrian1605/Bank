/**
 * Created by Adrian on 5/8/2016.
 */
'use strict';

var express = require('express');
var router = express.Router();
var db = require('../db');
const clientsController = require('../controllers/client');
const accountsController = require('../controllers/account');

router.get('/clients_list', clientsController.getClientsList);

router.get('/client/:id', clientsController.getClient);

router.put('/client', clientsController.updateClient);

router.post('/client', clientsController.createClient);

router.get('/accounts_list', accountsController.getAccountList);

router.get('/accounts_list/:id', accountsController.getAccountsByClient);


router.get('/account/:id', accountsController.getAccount);

router.post('/account', accountsController.createAccount);

router.put('/account', accountsController.updateAccount);

router.delete('/account/:id', accountsController.deleteAccount);

router.post('/transaction', accountsController.createTransaction);


module.exports = router;

function uuid(a){return a?(0|Math.random()*16).toString(16):(""+1e7+1e3+4e3+8e3+1e11).replace(/1|0/g,uuid).toUpperCase()}