/**
 * Created by adrianpogacean on 5/12/2016.
 */

const admin = {
    getEmployeeList: function(req, res, next) {
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
    },

    getEmployee:  function(req, res, next) {
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
    },

    updateEmployee: function(req, res, next) {
        var User = db.model('user'),
            params = req.body,
            id = params.id;

        delete params.id;
        params.date = new Date(Date.parse(params.date));
        User.update(params, {
            id: id
        }).then(function(userObj) {
            if(userObj) {
                res.send({type: 'success', user: params});
            }
        }).error(function(e) {
            log.warn("Could not read user based on id.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    },

    createEmployee: function(req, res, next) {
        var User = db.model('user'),
            params = req.body,
            firstName = params.first_name || '',
            lastName = params.last_name || '';

        params.date = new Date(Date.parse(params.date));
        params.username = firstName+lastName;
        params.password = params.username;

        User.create(params).then(function(userObj) {
            console.log('arguments ', arguments);
            if(userObj) {
                res.send({type: 'success', user: userObj});
            }
        }).error(function(e) {
            log.warn("Could not create user.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    },

    deleteEmployee: function(req, res, next) {
        var User = db.model('user');
        var id = req.params.id
        console.log('ID', id);

        User.find({
            where: {
                id: id
            }
        }).then(function(user) {
            console.log('USER ', user);
            user.destroy().then(function() {
                res.send({type: 'success'});
            });
        }).error(function(e) {
            log.warn("Could not delete user.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    },

    getEmployeeReport: function(req, res, next) {
        var Transaction = db.model('transaction');
        var User = db.model('user');
        var userId = req.params.id;
        var params = req.body;

        params.start_date = new Date(Date.parse(params.start_date));
        params.end_date = new Date(Date.parse(params.end_date));


        Transaction.findAll({
            where: {
                user_id: userId,
                //created_date: {
                //    lt: params.end_date,
                //    gte: params.start_date
                //}
            },
            include: [User]
        }).then(function(reportsObj) {
            if(reportsObj) {
                res.send({type: 'success', reports: reportsObj});
            }
        }).error(function(e) {
            log.warn("Could not read user reports.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    }
}


module.exports = admin;
