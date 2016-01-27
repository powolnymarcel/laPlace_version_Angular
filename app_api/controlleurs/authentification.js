var passport = require('passport');
var mongoose = require('mongoose');
var Utilisateur = mongoose.model('Utilisateur');

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};
module.exports.enregistrement = function(req, res) {
	if(!req.body.nom || !req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "Tous les champs sont requis"
		});
		return;
	}
	var utilisateur = new Utilisateur();
	utilisateur.nom = req.body.nom;
	utilisateur.email = req.body.email;
	utilisateur.setPassword(req.body.password);
	utilisateur.save(function(err) {
		var token;
		if (err) {
			sendJSONresponse(res, 404, err);
		} else {
			token = utilisateur.generateJwt();
			sendJSONresponse(res, 200, {
				"token" : token
			});
		}
	});
};


module.exports.login = function(req, res) {
	if(!req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, {
			"message": "Tous les champs sont requis"
		});
		return;
	}
	passport.authenticate('local', function(err, utilisateur, info){
		var token;
		if (err) {
			sendJSONresponse(res, 404, err);
			return;
		}
		if(utilisateur){
			token = utilisateur.generateJwt();
			sendJSONresponse(res, 200, {
				"token" : token
			});
		} else {
			sendJSONresponse(res, 401, info);
		}
	})(req, res);
};
