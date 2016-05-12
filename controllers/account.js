/**
 * Created by adrianpogacean on 5/12/2016.
 */

const account = {
    getAccountList: function(req, res, next) {
        const Client = db.model('client'),
            Account = db.model('account');

        Account.findAll().then(function(accountsObj) {
            console.log('ACCOUNTS OBJ: ', accountsObj);
            if(accountsObj) {
                res.send({type: 'success', accounts: accountsObj});
            }
        }).error(function(e) {
            log.warn("Could not create client.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    },

    getAccount: function(req, res, next) {
        var Account = db.model('account'),
            id = req.params.id;

        Account.find({
            where: {
                account_id: id
            }
        }).then(function(accountObj) {
            if(accountObj) {
                res.send({type: 'success', account: accountObj});
            }
        }).error(function(e) {
            log.warn("Could not read account based on id.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    },

    getAccountsByClient: function(req, res, next) {
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
    },

    createAccount: function(req, res, next) {
        var Account = db.model('account'),
            params = req.body;
        params.account_id = 'RO' + uuid();

        console.log('PARAMS : ', params);
        Account.create(params).then(function(accountObj) {
            if(accountObj) {
                res.send({type: 'success', account: accountObj});
            }
        }).error(function(e) {
            log.warn("Could not create account.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    },

    updateAccount: function(req, res, next) {
        var Account = db.model('account'),
            params = req.body,
            id = params.account_id;

        delete params.account_id;
        Account.update(params, {
            account_id: id
        }).then(function(accountObj) {
            if(accountObj) {
                res.send({type: 'success', account: params});
            }
        }).error(function(e) {
            log.warn("Could not read account based on id.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    },

    deleteAccount: function(req, res, next) {
        var Account = db.model('account');
        var id = req.params.id;

        Account.find({
            where: {
                account_id: id
            }
        }).then(function(account) {
            account.destroy().then(function() {
                res.send({type: 'success'});
            });
        }).error(function(e) {
            log.warn("Could not delete account.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    },

    createTransaction: function(req, res, next) {
        var Transaction = db.model('transaction'),
            Account = db.model('account'),
            params = req.body,
            amount = params.amount;


        console.log(req.session.user);
        params.user_id = req.session.userId;
        params.created_date = new Date();

        /* Substract money*/
        Account.find({
            where: {
                account_id: params.from
            }
        }).then(function(accountFrom) {
            if (accountFrom.money_amount < amount) {
                res.send({
                    type: 'error',
                    message: 'Insufficient funds.'
                });
            } else {
                Account.update(
                    {
                        money_amount: parseFloat(accountFrom.money_amount) - parseFloat(amount)
                    },
                    {
                        account_id: params.from
                    }
                ).then(function() {
                        if (params.type == 'transfer') {
                            /* Add money */
                            Account.find({
                                where: {
                                    account_id: params.to
                                }
                            }).then(function(accountFrom) {
                                Account.update(
                                    {
                                        money_amount: parseFloat(accountFrom.money_amount) + parseFloat(amount)
                                    },
                                    {
                                        account_id: params.to
                                    }
                                ).then(function() {
                                        insertIntoTransactions();
                                    });
                            });
                        } else {
                            insertIntoTransactions();
                        }
                    });
            }
        });

        var insertIntoTransactions = function() {
            Transaction.create(params).then(function(transactionObj) {
                if(transactionObj) {
                    res.send({
                        type: 'success',
                        message: 'Your transaction was processed successfully.',
                        transaction: transactionObj
                    });
                }
            }).error(function(e) {
                log.warn("Could not create transaction.");
                log.error(e);
                return res.error(500, "SERVER_ERROR");
            });
        }
    }
}

module.exports = account;