var mongoose = require( 'mongoose' );

//Module NodeJS pour crypter le pass
var crypto = require('crypto');
//Module pour le JSON WEB TOKEN
var jwt = require('jsonwebtoken');


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
	admin:{type:Boolean,"default":false},
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

//Generer un JWT (se prononce "JOT")
utilisateurSchema.methods.generateJwt = function() {
	//Ajout d'une date d'expiration pour le token
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);
	//Le sign est une methode de la librairie JWT, permet de generer un JWT
	return jwt.sign({
		_id: this._id,
		email: this.email,
		nom: this.nom,
		admin:this.admin,
		exp: parseInt(expiry.getTime() / 1000),
	}, process.env.JWT_SECRET );
};
mongoose.model('Utilisateur', utilisateurSchema);
