//Pour lire les *.env, là ou sont par exemple stockée les variables d'environements, ce fichier .env est à ajouter dans gitignore afin d'eviter de l'up sur github
require('dotenv').load();

//---------------------------------------------------------------
/*           Structure de base generée avec EXPRESS            */
//---------------------------------------------------------------

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Pour minifier le code
var uglifyJs = require("uglify-js");
var fs = require('fs');
var passport = require('passport');


//Config de la BDD
require('./app_api/modeles/bdd');
require('./app_api/config/passport');
//**
var port = process.env.PORT || 3000;
var routes = require('./app_server/routes/index');
var routesApi = require('./app_api/routes/index');
var users =  require('./app_server/routes/users');
var app = express();

//---------------------------------------------------------------
/*                 Config Moteur de vues                       */
//---------------------------------------------------------------
app.set('views', path.join(__dirname,'app_server', 'vues'));
app.set('view engine', 'jade');


//---------------------------------------------------------------
/*             		 	   minification                       */
//---------------------------------------------------------------

var appClientFiles = [
	'app_client/app.js',
	'public/javascripts/accueil/accueilCtrl.js',
	'public/javascripts/aProposCtrl.js',
	'app_client/commun/services/geolocalisation.service.js',
	'app_client/commun/services/laPlaceData.service.js',
	'app_client/commun/filtres/distanceFormatee.filter.js',
	'app_client/commun/filtres/ajoutBr.filter.js',
	'app_client/commun/directives/noteEtoilees/noteEtoilees.directive.js',
	'app_client/commun/directives/footerGenerique/footerGernerique.directive.js',
	'app_client/commun/directives/navigation/navigation.directive.js',
	'app_client/commun/vues/endroitDetail/endroitDetailsCtrl.js',
	'app_client/commun/vues/commentaireModal/commentaireModalCtrl.js',
	'app_client/commun/endroitEdit/endroitEditCtrl.js',
	'app_client/commun/services/authentification.service.js',
	'app_client/commun/authentification/enregistrement/enregistrementCtrl.js',
	'app_client/commun/authentification/login/loginCtrl.js',
	'app_client/commun/directives/navigation/navigationCtrl.js',
	'app_client/commun/endroitAjouter/endroitAjouterCtrl.js'
];
var uglified = uglifyJs.minify(appClientFiles, { compress : false });
fs.writeFile('public/angular/laPlace.min.js', uglified.code, function (err){
	if(err) {
		console.log(err);
	} else {
		console.log('Script generated and saved: laPlace.min.js');
	}
});
//---------------------------------------------------------------
/*                          MIDDLEWARE                         */
//---------------------------------------------------------------
// Dé-commenter apres avoir placé le favicon dans  /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));


app.use(passport.initialize());
//---------------------------------------------------------------
/*                          Routes                             */
//---------------------------------------------------------------
//app.use('/', routes);

app.use('/api', routesApi);
app.use('/users', users);

app.use(function(req, res) {
	res.sendFile(path.join(__dirname, 'app_client', 'index.html'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//---------------------------------------------------------------
/*                     error handlers                          */
//---------------------------------------------------------------
// Catch unauthorised errors
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		res.json({"message" : err.name + ": " + err.message});
	}
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


console.log('----> Serveur lancé sur le port : ' + port );
module.exports = app;
