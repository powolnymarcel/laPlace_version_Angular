var mongoose = require( 'mongoose' );
var crypto = require('crypto');


var utilisateurSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	nom: {
		type: String,
		required: true
	},
	hash: String,
	salt: String
});

//Crypter et saler le password ! IMPORTANT !
utilisateurSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};
//Verification des donnees au login
utilisateurSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};
