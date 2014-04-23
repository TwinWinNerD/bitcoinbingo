/**
 * SessionController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	// CREATE
    create: function (request, response) {
 
    	var username, password;

    	username = request.body.username;
    	password = request.body.password;

    	User.findOne().where( { username: username, password: password }).exec(function (error, user) {
    		
    		if (user && user !== null) {
    			request.session.user = user;
    			response.status(201).send(user);
    		} else {
    			response.send(401);
    		}
    		
    	});
    	
    },

	// RETRIEVE
	show: function (request, response) {

		if (request.session.user) {
			response.status(200).send(request.session.user.username);
		} else {
			response.send(404);
		}
	},

	// DELETE
	del: function (request, response) {

		if (request.session.user) {
			delete request.session.user;
			return response.status(204);
		} else {
			return response.status(404);
		}
	}

};
