var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Utilisateur = mongoose.model('Utilisateur');


passport.use(new LocalStrategy({
		usernameField: 'email'
	},
	function(username, password, done) {
		//Mongoose cherche le bon USER
		Utilisateur.findOne({ email: username }, function (err, utilisateur) {
			if (err) { return done(err); }
			//Si pas d'user:message erreur
			if (!utilisateur) {
				return done(null, false, {
					message: 'Incorrect utilisateur.'
				});
			}
			//Mongooser verifie grace à la méthose du schéma si le pass est bon
			if (!utilisateur.validPassword(password)) {
				return done(null, false, {
					message: 'Incorrect password.'
				});
			}
			//Retourne l'objt utilisateur
			return done(null, utilisateur);
		});
	}
));
