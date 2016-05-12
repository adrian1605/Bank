/**
 * Created by adrianpogacean on 5/12/2016.
 */
const login = {
    getIndex: function(req, res, next) {
        res.render('login', {isLogin: true});
    },
    doLogin: function(req, res, next) {
        var User = db.model('user'),
            params = req.body;

        User.find({
            where: {
                username: params.username,
                password: params.password
            }
        }).then(function(userObj) {
            if(userObj) {
                req.session.user = userObj.username;
                req.session.admin = userObj.is_admin;
                req.session.userId = userObj.id;
                res.send({type: 'success', isAdmin: userObj.is_admin});
            } else {
                res.send({type: 'error', message: 'Login failed'});
            }
        }).error(function(e) {
            log.warn("Could not find user based on credentials.");
            log.error(e);
            return res.error(500, "SERVER_ERROR");
        });
    }
}
module.exports = login;