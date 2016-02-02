var mongoose = require('mongoose');
//Appel du modele "Endroit"
var Endroit = mongoose.model('Endroit');

//Pour permettre à ce controlleur de faire des appels sur l'API
var request = require('request');

//Permet à mongoDB de calculer une distance... Pas vraiment compris...
var theEarth = (function(){
	var earthRadius = 6371; // km, miles is 3959
	var getDistanceFromRads = function(rads) {
		return parseFloat(rads * earthRadius);
	};
	var getRadsFromDistance = function(distance) {
		return parseFloat(distance / earthRadius);
	};
	return {
		getDistanceFromRads : getDistanceFromRads,
		getRadsFromDistance : getRadsFromDistance
	};
})();

//---------------------------------------------------------------
/*              Fn pour le status + message                    */
//---------------------------------------------------------------
// Permet d'envoyer le code de status, un message et le contenu en JSON
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};





//---------------------------------------------------------------
/*                 Recuperation infos AUTEUR       		       */
//---------------------------------------------------------------
var Utilisateur = mongoose.model('Utilisateur');
var recupAuteur = function(req, res, callback) {
	//Si il y a un JWT et un payload email
	if (req.payload && req.payload.email) {
		//On cherche l'user via l'email
		Utilisateur
			.findOne({ email : req.payload.email })
			.exec(function(err, utilisateur) {
				if (!utilisateur) {
					sendJSONresponse(res, 404, {
						"message": "Utilisateur non trouvé"
					});
					return;
				} else if (err) {
					console.log(err);
					sendJSONresponse(res, 404, err);
					return;
				}
				//On retourne le nom de l'utilisateur
				callback(req, res, utilisateur);
			});
	} else {
		sendJSONresponse(res, 404, {
			"message": "Utilisateur  trouvé!"
		});
		return;
	}
};















//---------------------------------------------------------------
/*              VOIR ENDROIT PAR DISTANCE                      */
//---------------------------------------------------------------
/* GET api/endroits */
/* Recupère la liste des endroits basés sur la requete de distance */
module.exports.endroitsListeParDistance = function(req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDistance = parseFloat(req.query.maxDistance);
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	var geoOptions = {
		spherical: true,
		maxDistance: maxDistance,
		num: 10
	};
	if (!lng || !lat || !maxDistance) {
		console.log('il manque des parametres pour la fn endroitsListeParDistance ');
		sendJsonResponse(res, 404, {
			"message": "les parametres : lng, lat et maxDistance sont tous requis!"
		});
		return;
	}
	Endroit.geoNear(point, geoOptions, function(err, results, stats) {
		var endroits;
		console.log('Geo Resultats', results);
		console.log('Geo stats', stats);
		if (err) {
			console.log('geoNear error:', err);
			sendJsonResponse(res, 404, err);
		} else {
			endroits = construireLaListeDesEndroits(req, res, results, stats);
			sendJsonResponse(res, 200, endroits);
		}
	});
};
var construireLaListeDesEndroits = function(req, res, results, stats) {
	var endroits = [];
	results.forEach(function(doc) {

		endroits.push({
			distance: doc.dis/1000,
			nom: doc.obj.nom,
			adresse: doc.obj.adresse,
			note: doc.obj.note,
			services: doc.obj.services,
			_id: doc.obj._id
		});
	});
	return endroits;
};

//---------------------------------------------------------------
/*                  VOIR ENDROIT  PAR ID                       */
/*                  VOIR ENDROIT  PAR ID                       */
//---------------------------------------------------------------
/* GET /api/endroits */
module.exports.endroitsVoir = function(req, res) {
	console.log('Affichage des details de l\'endroit avec ID: ', req.params);
	if (req.params && req.params.endroitsid) {
		//Endroit = le modèle Endroit
		Endroit
			.findById(req.params.endroitsid)
			.exec(function(err, endroits) {
				if (!endroits) {
					console.log('*identifiant de l\'endroit non trouve*');
					sendJsonResponse(res, 404, {
						"message": "identifiant de l'endroit non trouve"
					});
					return;
				}
				else if (err) {
					console.log(err);
					sendJsonResponse(res, 404, err);
					return;
				}
				console.log(endroits);
				sendJsonResponse(res, 200, endroits);
			});
	} else {
		console.log('Pas d\'endroit spécifié dans la requete');
		sendJsonResponse(res, 404, {
			"message": "Pas d'endroit spécifié dans la requete"
		});
	}
};
//---------------------------------------------------------------
/*                  CREER ENDROIT                              */
//---------------------------------------------------------------
/*POST /api/endroits */
module.exports.creationEndroit = function(req, res) {
	console.log(req.body)

	recupAuteur(req, res, function (req, res, auteur) {
		if(auteur.admin){
			Endroit.create({
				nom: req.body.nom,
				adresse: req.body.adresse,
				services: req.body.services.split(","),
				coords:  [parseFloat(req.body.coords[0]), parseFloat(req.body.coords[1])],
				heuresOuverture: [{
					jours: req.body.heuresOuverture[0].jours,
					ouverture:req.body.heuresOuverture[0].ouverture,
					fermeture:req.body.heuresOuverture[0].fermeture,
					ferme: req.body.heuresOuverture[0].ferme
				}, {
					jours: req.body.heuresOuverture[1].jours,
					ouverture: req.body.heuresOuverture[1].ouverture,
					fermeture: req.body.heuresOuverture[1].fermeture,
					ferme: req.body.heuresOuverture[1].ferme
				}]
			}, function(err, endroits) {
				if (err) {
					sendJsonResponse(res, 400, err);
				} else {
					sendJsonResponse(res, 201, endroits);
				}
			});
		}
		else {
			sendJsonResponse(res, 401, err);
		}
	});
};



module.exports.editerEndroitFin = function(req, res) {

	var requestOptions, path;
	path = "/api/endroits/" + req.params.endroitsid;
	requestOptions = {
		url : "http://localhost:3000" + path,
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



//---------------------------------------------------------------
/*                  METTRE A JOUR ENDROIT                      */
//---------------------------------------------------------------
/* PUT /api/endroits/:endroitsid */
module.exports.endroitsUpdate = function(req, res) {
	console.log( req.body);
	console.log("ssssssssssssssssssssssssssssssssssssssss");
	console.log( req.body.heuresOuverture);
	console.log("ssssssssssssssssssssssssssssssssssssssss");
	if (!req.params.endroitsid) {
		sendJsonResponse(res, 404, {
			"message": "Pas trouve, le id de l'endroit est requis"
		});
		return;
	}


	recupAuteur(req, res, function (req, res, auteur) {
		if(auteur.admin){


	Endroit.findById(req.params.endroitsid)
		//Select tous sauf les 2 champs suivants
		.select('-commentaires -note')
		.exec(
			function(err, endroits) {
				if (!endroits) {
					sendJsonResponse(res, 404, {
						"message": "ID endroit non trouve"
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				console.log('ENDROIT TROUVE, pret pour l\'update de:  '+req.params.endroitsid);

				endroits.nom = req.body.nom;
				endroits.adresse = req.body.adresse;
				endroits.services = req.body.services.split(',');
				endroits.coords = [parseFloat(req.body.coords[0]), parseFloat(req.body.coords[1])];
				endroits.heuresOuverture = [{
					jours: req.body.heuresOuverture[0].jours,
					ouverture:req.body.heuresOuverture[0].ouverture,
					fermeture:req.body.heuresOuverture[0].fermeture,
					ferme: req.body.heuresOuverture[0].ferme
				}, {
					jours: req.body.heuresOuverture[1].jours,
					ouverture: req.body.heuresOuverture[1].ouverture,
					fermeture: req.body.heuresOuverture[1].fermeture,
					ferme: req.body.heuresOuverture[1].ferme
				}];
				endroits.save(function(err, endroits) {
					if (err) {
						sendJsonResponse(res, 404, err);
					} else {
						sendJsonResponse(res, 200, endroits);
					}
				});
			}
		);
	}
})

};


//---------------------------------------------------------------
/*                  DELETE ENDROIT                             */
//---------------------------------------------------------------
/* DELETE /api/endroits/:endroitsid */
module.exports.endroitsDelete = function(req, res) {
	var endroitsid = req.params.endroitsid;
	recupAuteur(req, res, function (req, res, auteur) {
		if(auteur.admin){
			if (endroitsid) {
				Endroit
					.findByIdAndRemove(endroitsid)
					.exec(
						function(err, endroits) {
							if (err) {
								console.log(err);
								sendJsonResponse(res, 404, err);
								return;
							}
							console.log("ID endroit " + endroitsid + " SUPPRIME !!!");
							sendJsonResponse(res, 204, null);
						}
					);
			} else {
				sendJsonResponse(res, 404, {
					"message": "Pas de ID endroit"
				});
			}
		}
	})
};
