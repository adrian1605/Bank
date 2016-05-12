/**
 * Created by adrianpogacean on 5/12/2016.
 */

const client = {
    getClientsList: function(req, res, next) {
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
    },

    getClient: function(req, res, next) {
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
    },

    updateClient: function(req, res, next) {
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
    },

    createClient: function(req, res, next) {
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
    }
};

module.exports = client;