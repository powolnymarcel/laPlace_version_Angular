//Pour permettre à ce controlleur de faire des appels sur l'API
var request = require('request');

//---------------------------------------------------------------
/*          Fn pour les erreurs                                */
//---------------------------------------------------------------
var _montrerErreur = function (req, res, status) {
	var titre, contenu;
	if (status === 404) {
		titre = "404, pag non trouvee";
		contenu = "Nous ne sommes pas en mesure de trouver la page demandée. Verifier votre lien internet.";
	} else {
		titre = status + ", une erreur s'est produite.";
		contenu = "Quelque chose, quelque part a mal fonctionné";
	}
	res.status(status);
	res.render('erreurSurLeSite', {
		titre : titre,
		contenu : contenu
	});
};
//---------------------------------------------------------------
/*             ------------------------------------            */
//---------------------------------------------------------------


//---------------------------------------------------------------
/*          Fn pour les Recup les infos d'un endroit           */
//---------------------------------------------------------------
//Un appel est lancé sur l'api avec l'id de l'endroit voulu
// La réponse est contenue dans la callback
var getInfosEndroit = function (req, res, callback) {
	var requestOptions, path;
	path = "/api/endroits/" + req.params.endroitsid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(
		requestOptions,
		function(err, response, body) {
			var data = body;
			if (response.statusCode === 200) {
				data.coords = {
					lng : body.coords[0],
					lat : body.coords[1]
				};
				callback(req, res, data);
			} else {
				_montrerErreur(req, res, response.statusCode);
			}
		}
	);
};
//---------------------------------------------------------------
/*             ------------------------------------            */
//---------------------------------------------------------------



//---------------------------------------------------------------
/* Pour le midlleware REQUEST                                  */
//---------------------------------------------------------------
//Pour savoir si on travaille en local ou sur l'hebergeur
var apiOptions = {
	server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://sleepy-waters-7506.herokuapp.com";
}
//---------------------------------------------------------------
/*             ------------------------------------            */
//---------------------------------------------------------------


//---------------------------------------------------------------
/* Render pour la page d'accueil                               */
//---------------------------------------------------------------

module.exports.listingAccueilEndroits = function(req, res){
				renderDeLaPageAccueil(req, res);
		};
/* RENDER  pour la page d'accueil */
var renderDeLaPageAccueil = function(req, res){
	res.render('liste-accueil-endroits', {
		titre: 'laPlace, trouver des commerces proche de chez vous.',
		headerDeLaPage: {
			titre: 'laPlace',
			tagLine: 'Trouver des commerces proche de chez vous.'
		},
		sidebar: "La distance est calculée à partir d'un point donné sur Soumagne"
	});
};
//---------------------------------------------------------------
/*             ------------------------------------            */
//---------------------------------------------------------------


//---------------------------------------------------------------
/* Render pour la page information detaillées sur l'endroit    */
//---------------------------------------------------------------
/* GET pout la page infos detailless endroit*/
module.exports.infoEndroit = function(req, res){
	//Cette fn ci dessous contient "req.params.endroitsid;" qui lui permet de faire un appel sur l'api et ainsi récup les infos de l'endroit
	//La réponse est contenue dans "responseData", cette réponse est ensuite envoyée à la fn "renderDeLaPageDetailsEndsroit"
	getInfosEndroit(req, res, function(req, res, responseData) {
		console.log('*********************************************');
		console.log('*********************************************');
		console.log(responseData);
		console.log('*********************************************');
		console.log('*********************************************');
		renderDeLaPageDetailsEndsroit(req, res, responseData);
	});
};

/* RENDER page infos detailless endroit*/
// Parametre "detailsEndroitUnique" = "responseData" de la fn "getInfosEndroit"
// On envoire à JADE: un titre,headerDeLaPage, sidebar ET endroit qui est l'objet endroit(voir exemple ci dessous)
var renderDeLaPageDetailsEndsroit = function (req, res,detailsEndroitUnique) {
	res.render('info-endroit', {
		titre: detailsEndroitUnique.nom,
		headerDeLaPage: {
			titre: detailsEndroitUnique.nom
		},
		sidebar: {
			texte: 'Se trouve sur laPlace car c est un commerce qui a ete demandé par la communaute',
			tagline: 'Si vous avez quelque chose à dire sur ce commerce, veuillez le faire via le formulaire.'
		},
		endroit:detailsEndroitUnique
	});
};
// -----------------   EXEMPLE --------------------------
/*
{ _id: '569aeae5c1a3d813479e6814',
	nom: 'Carrefour',
	adresse: 'Rue du commerce 743, 4444 LIEGE',
	coords: { lng: 5.722622, lat: 50.626806 },
	commentaires:
		[ { auteur: 'Marie',
			id: '569aeb3c85f250692df1f891',
			note: 5,
			texte: 'Magasin carrefour, je recommande',
			temps: '2016-01-16T23:00:00.000Z' } ],
			heuresOuverture:
	[ { jours: 'Lundi - Vendredi',
		ouverture: '7:00',
		fermeture: '19:00',
		ferme: false },
		{ jours: 'Samedi',
			ouverture: '8:00',
			fermeture: '17:00',
			ferme: false },
		{ jours: 'Dimanche', ferme: true } ],
		services: [ 'Poissons frais', 'Alcool', 'Charcuterie' ],
	note: 5 }
*/

//---------------------------------------------------------------
/*             ------------------------------------            */
//---------------------------------------------------------------


//---------------------------------------------------------------
/* Render pour la page ajouter un commentaire                   */
//---------------------------------------------------------------
/* GET pout la page ajouter commentaire*/
module.exports.ajouterCommentaire = function(req, res){
	getInfosEndroit(req, res, function(req, res, responseData) {
		renderAjouterCommentaire(req, res, responseData);
	});
};



/* RENDER pout la page ajouter commentaire*/
var renderAjouterCommentaire = function (req, res, jeSuisLeCallbackContenantLesInfosEndroits) {
	res.render('ajout-commentaire', {
		titre: 'Commentaire ' + jeSuisLeCallbackContenantLesInfosEndroits.nom + ' sur laPlace',
		headerDeLaPage: { titre: 'Ajouter un commentaire sur ' + jeSuisLeCallbackContenantLesInfosEndroits.nom },
		erreur: req.query.erreur,
		url: req.originalUrl
			});
};
//---------------------------------------------------------------
/*             ------------------------------------            */
//---------------------------------------------------------------

module.exports.actionAjouterCommentaire = function(req, res){
		var requestOptions, path, endroitsid, donneesProvennantDuFormulaireCommentaire;
	endroitsid = req.params.endroitsid;
		path = "/api/endroits/" + endroitsid + '/commentaires';
		donneesProvennantDuFormulaireCommentaire = {
			auteur: req.body.nom,
			note: parseInt(req.body.note, 10),
			texte: req.body.texte
		};

	requestOptions = {
		url : apiOptions.server + path,
		method : "POST",
		json : donneesProvennantDuFormulaireCommentaire
	};
	//Avant l'appel API on verifie si des données sont présente
	if (!donneesProvennantDuFormulaireCommentaire.auteur || !donneesProvennantDuFormulaireCommentaire.note || !donneesProvennantDuFormulaireCommentaire.texte) {
		res.redirect('/endroits/' + endroitsid + '/commentaires/nouveau?erreur=val');
	} else {
		//Si les données sont présente on fait l'appel API, mongoose fera aussi sa vérification
	request(
		requestOptions,
		function(err, response, body) {
			if (response.statusCode === 201) {
				res.redirect('/endroits/' + endroitsid);
			}
			//SI erreur 400, voir plus bas le type erreur mongoose
			 else if (response.statusCode === 400 && body.name && body.name ===
			"ValidationError" ) {
				//On redirige vers la page du commentaire avec un parametre : erreur=val -- ce param sera affiché par la Fn "renderAjouterCommentaire" VOIR erreur: req.query.err
			res.redirect('/endroits/' + endroitsid + '/commentaires/nouveau?erreur=val');
			}
			else {
				_montrerErreur(req, res, response.statusCode);
			}
		}
	);
	};
};



//Erreur de provennant de mongoose qui indique que le path TEXTE est requis et que l'user n'a rien indiqué
/*{
	message: 'Validation failed',
		name: 'ValidationError',
	errors: {
	'commentaires.1.texte': {
		message: 'Path `texte` is required.',
			name: 'ValidatorError',
			path: 'texte',
			type: 'required',
			value: ''
	}
}*/













//---------------------------------------------------------------
/*                     EXPERIMENTAL....                        */
//---------------------------------------------------------------
module.exports.ajoutEndroit = function(req, res) {
	res.render('ajout-endroit', {
		titre: 'ajout-endroit',
		headerDeLaPage: {
			titre: 'ajout endroit'
		}
	});
};


var renderEdit = function(req, res,responseBody){

	res.render('edit-endroits', {
		endroits: responseBody
	});
};
module.exports.editerEndroit = function(req, res) {
	var requestOptions, path;
	path = "/api/endroits/" + req.params.endroitsid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(
		requestOptions,
		function(err, response, body) {
			var data = body;
				renderEdit(req, res,data);

		}
	);
};



var renderEditFin = function(req, res,responseBody){

	res.render('edit-endroits', {
		endroits: responseBody
	});
};
module.exports.editerEndroitFin = function(req, res) {

	var requestOptions, path;
	path = "/api/endroits/" + req.params.endroitsid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "PUT",
		json : req.body
	};
	request(
		requestOptions,
		function(err, response, body) {
			var data = body;
			renderEditFin(req, res,data);

		}
	);
};
