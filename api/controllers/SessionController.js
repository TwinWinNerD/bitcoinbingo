/**
 * SessionController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	// CREATE
    create: function (req, res) {
 
    	var username, password;

    	username = req.body.username;
    	password = req.body.password;


        if(typeof req.session.user === "undefined" || req.session.user === null) {
            User.findOne().where( { username: username, password: password }).exec(function (error, user) {

                if (user && user !== null) {
                    req.session.user = user;
                    res.send(user);
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
