/**
 * Created by Adrian on 4/10/2016.
 */
'use strict';

var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/', function(req, res, next) {
    if (!req.session.user) {
        res.redirect('login');
    }
    res.render('dashboard', { title: 'Dashboard' });
});

router.get('/employee_list', function(req, res, next) {
    var User = db.model('user');

    User.findAll({
        //where: {
        //    is_admin: 0
        //}
    }).then(function(userObj) {
        if(userObj) {
            res.send({type: 'success', users: userObj});
        }
    }).error(function(e) {
        log.warn("Could not read users.");
        log.error(e);
        return res.error(500, "SERVER_ERROR");
    });
});

router.get('/employee', function(req, res, next) {
    var User = db.model('user'),
        params = req.query;
    User.find({
        where: {
            id: params.user_id
        }
    }).then(function(userObj) {
        if(userObj) {
            res.send({type: 'success', user: userObj});
        }
    }).error(function(e) {
        log.warn("Could not read user based on id.");
        log.error(e);
        return res.error(500, "SERVER_ERROR");
    });
});

router.put('/employee', function(req, res, next) {
    var User = db.model('user'),
        params = req.body,
        id = params.id;
    delete params.id;
    delete params.birth_date;
    console.log('PARAMS: ', params);
    User.update(params, {
        id: id
    }).then(function(userObj) {
        console.log('arguments ', arguments);
        if(userObj) {
            res.send({type: 'success', user: userObj});
        }
    }).error(function(e) {
        log.warn("Could not read user based on id.");
        log.error(e);
        return res.error(500, "SERVER_ERROR");
    });
});

module.exports = router;
