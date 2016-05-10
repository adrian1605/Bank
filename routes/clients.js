/**
 * Created by Adrian on 5/8/2016.
 */
'use strict';

var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/clients_list', function(req, res, next) {
    var Client = db.model('client');

    Client.findAll({
        //where: {
        //    is_admin: 0
        //}
    }).then(function(clientObj) {
        if(clientObj) {
            res.send({type: 'success', clients: clientObj});
        }
    }).error(function(e) {
        log.warn("Could not read clients.");
        log.error(e);
        return res.error(500, "SERVER_ERROR");
    });
});

router.get('/client/:id', function(req, res, next) {
    var Client = db.model('client'),
        id = req.params.id;
    Client.find({
        where: {
            id: id
        }
    }).then(function(clientObj) {
        if(clientObj) {
            res.send({type: 'success', client: clientObj});
        }
    }).error(function(e) {
        log.warn("Could not read client based on id.");
        log.error(e);
        return res.error(500, "SERVER_ERROR");
    });
});

router.put('/client', function(req, res, next) {
    var Client = db.model('client'),
        params = req.body,
        id = params.id;

    delete params.id;
    Client.update(params, {
        id: id
    }).then(function(clientObj) {
        if(clientObj) {
            res.send({type: 'success', client: params});
        }
    }).error(function(e) {
        log.warn("Could not read client based on id.");
        log.error(e);
        return res.error(500, "SERVER_ERROR");
    });
});

router.post('/client', function(req, res, next) {
    var Client = db.model('client'),
        params = req.body;

    Client.create(params).then(function(clientObj) {
        if(clientObj) {
            res.send({type: 'success', client: clientObj});
        }
    }).error(function(e) {
        log.warn("Could not create client.");
        log.error(e);
        return res.error(500, "SERVER_ERROR");
    });
});

router.get('/accounts/:id', function(req, res, next) {
    const Client = db.model('client'),
          Account = db.model('account'),
          clientId = req.params.id;


    Account.findAll({
        where: {client_id: clientId},
        include: [Client]
    }).then(function(accountsObj) {
        console.log('ACCOUNTS OBJ: ', accountsObj);
        if(accountsObj) {
            res.send({type: 'success', accounts: accountsObj});
        }
    }).error(function(e) {
        log.warn("Could not create client.");
        log.error(e);
        return res.error(500, "SERVER_ERROR");
    });
});

module.exports = router;