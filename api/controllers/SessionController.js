/**
 * SessionController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var bcrypt;

bcrypt = require('bcrypt');

module.exports = {

	// CREATE
    create: function (req, res) {
 
    	var username, password;

    	username = req.body.username;
    	password = req.body.password;


        if(typeof req.session.user === "undefined" || req.session.user === null) {
            User.findOne().where( { username: username }).exec(function (error, user) {

                if (user && user !== null) {

                    bcrypt.compare(password, user.password, function(err, result) {
                        if(result) {
                            req.session.user = user;
                            res.send(user);
                        } else {
                            res.json(500, { error: "We couldn't log you in with these details."});
                        }

                    });

                } else {
                    res.json(500, { error: "We couldn't log you in with these details."});
                }

            });
        } else {
            res.send(req.session.user);
        }

    },

	// DELETE
	del: function (request, response) {

		if (request.session.user) {
			request.session.user = null;
			response.send(204);
		} else {
			response.send(404);
		}
	}

};
