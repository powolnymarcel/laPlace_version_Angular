var mongoose = require('mongoose');
//Appel du modele "Endroit"
var Endroit = mongoose.model('Endroit');

//---------------------------------------------------------------
/*              Fn pour le status + message                    */
//---------------------------------------------------------------
// Permet d'envoyer le code de status et un message
var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

//---------------------------------------------------------------
/*                  CREATION COMMENTAIRE (4 étapes)            */
//---------------------------------------------------------------
module.exports.creationCommentaire = function(req, res) {
	var endroitsid = req.params.endroitsid;
	if (endroitsid) {
		Endroit
			.findById(endroitsid)
			.select('commentaires')
			.exec(
				function(err, endroits) {
					if (err) {
						sendJsonResponse(res, 400, err);
					} else {
						ajouterLeCommentaire(req, res, endroits);
					}
				}
			);
	} else {
		sendJsonResponse(res, 404, {
			"message": "Pas trouvé, id endroit requis"
		});
	}
};

//---------------------------------------------------------------
/*                  CREATION COMMENTAIRE      +                */
/*                  AJOUT DU COMMENTAIRE                       */
//---------------------------------------------------------------
var ajouterLeCommentaire = function(req, res, endroits) {
	if (!endroits) {
		sendJsonResponse(res, 404, {
			"message": "id de l'endroit non trouve"
		});
	} else {
		endroits.commentaires.push({
			auteur: req.body.auteur,
			note: req.body.note,
			texte: req.body.texte
		});
		endroits.save(function(err, endroits) {
			var ceCommentaire;
			if (err) {
				sendJsonResponse(res, 400, err);
			} else {
				mettreAjourNoteGlobaleEndroit(endroits._id);
				ceCommentaire = endroits.commentaires[endroits.commentaires.length - 1];
				sendJsonResponse(res, 201, ceCommentaire);
			}
		});
	}
};

//---------------------------------------------------------------
/*                  CREATION COMMENTAIRE      +                */
/*                  AJOUT DU COMMENTAIRE      +                */
/*                 METTRE A JOUR NOTE ETABLISSMENT             */
//---------------------------------------------------------------
var mettreAjourNoteGlobaleEndroit = function(endroitsid) {
	Endroit
		.findById(endroitsid)
		.select('note commentaires')
		.exec(
			function(err, endroits) {
				if (!err) {
					executerNoteMoyenne(endroits);
				}
			});
};
//---------------------------------------------------------------
/*                  CREATION COMMENTAIRE      +                */
/*                  AJOUT DU COMMENTAIRE      +                */
/*                 METTRE A JOUR NOTE ETABLISSMENT  +          */
/*                 CALCUL DE LA NOTE MOYENNE                   */
//---------------------------------------------------------------
var executerNoteMoyenne = function(endroits) {
	var i, nombreCommentaire, noteMoyenne, sommeNote;
	if (endroits.commentaires && endroits.commentaires.length > 0) {
		nombreCommentaire = endroits.commentaires.length;
		sommeNote = 0;
		for (i = 0; i < nombreCommentaire; i++) {
			sommeNote = sommeNote + endroits.commentaires[i].note;
		}
		noteMoyenne = parseInt(sommeNote / nombreCommentaire, 10);
		endroits.note = noteMoyenne;
		endroits.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Note moyenne mise à jour --->> ", noteMoyenne);
			}
		});
	}
};

//---------------------------------------------------------------
/*                  VOIR COMMENTAIRE                           */
//---------------------------------------------------------------
module.exports.commentaireVoir = function(req, res) {
	if (req.params && req.params.endroitsid && req.params.commentairesid) {
		Endroit
			.findById(req.params.endroitsid)
			.select('nom commentaires')
			.exec(
				function(err, endroits) {
					var response, commentaire;
					if (!endroits) {
						sendJsonResponse(res, 404, {
							"message": "l'id de l'endroit est non trouve"
						});
						return;
					} else if (err) {
						sendJsonResponse(res, 400, err);
						return;
					}
					if (endroits.commentaires && endroits.commentaires.length > 0) {
						commentaire = endroits.commentaires.id(req.params.commentairesid);
						if (!commentaire) {
							sendJsonResponse(res, 404, {
								"message": "l'id du commentaire est non trouve"
							});
						} else {
							response = {
								endroits : {
									nom : endroits.nom,
									id : req.params.endroitsid
								},
								commentaire : commentaire
							};
							sendJsonResponse(res, 200, response);
						}
					} else {
						sendJsonResponse(res, 404, {
							"message": "Aucuns commentaire trouvé"
						});
					}
				}
			);
	} else {
		sendJsonResponse(res, 404, {
			"message": "Pas trouve, l'id de l'endroit & du commentaire sont requis"
		});
	}
};


//---------------------------------------------------------------
/*                  UPDATE COMMENTAIRE                         */
//---------------------------------------------------------------
module.exports.commentaireUpdate = function(req, res) {
	if (!req.params.endroitsid || !req.params.commentairesid) {
		sendJsonResponse(res, 404, {
			"message": "Non trouve, id endroits et id commentaire sont tous 2 requis"
		});
		return;
	}
	Endroit
		.findById(req.params.endroitsid)
		.select('commentaires')
		.exec(
			function(err, endroits) {
				var ceCommentaire;
				if (!endroits) {
					sendJsonResponse(res, 404, {
						"message": "ID endroit non trouve"
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				if (endroits.commentaires && endroits.commentaires.length > 0) {
					ceCommentaire = endroits.commentaires.id(req.params.commentairesid);
					if (!ceCommentaire) {
						sendJsonResponse(res, 404, {
							"message": "ID commentaire non trouve"
						});
					} else {
						ceCommentaire.auteur = req.body.auteur;
						ceCommentaire.note = req.body.note;
						ceCommentaire.texte = req.body.texte;
						endroits.save(function(err, endroits) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								mettreAjourNoteGlobaleEndroit(endroits._id);
								sendJsonResponse(res, 200, ceCommentaire);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "Aucuns commentaire à mettre à jour"
					});
				}
			}
		);
};






//---------------------------------------------------------------
/*                  DELETE COMMENTAIRE                         */
//---------------------------------------------------------------
// app.delete('/api/endroits/:endroitsid/commentaires/:commentairesid'
module.exports.commentaireDelete = function(req, res) {
	if (!req.params.endroitsid || !req.params.commentairesid) {
		sendJsonResponse(res, 404, {
			"message": "Non trouve, id endroits et id commentaire sont tous 2 requis"
		});
		return;
	}
	Endroit
		.findById(req.params.endroitsid)
		.select('commentaires')
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
				if (endroits.commentaires && endroits.commentaires.length > 0) {
					if (!endroits.commentaires.id(req.params.commentairesid)) {
						sendJsonResponse(res, 404, {
							"message": "ID commentaire non trouve"
						});
					} else {
						endroits.commentaires.id(req.params.commentairesid).remove();
						endroits.save(function(err) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								mettreAjourNoteGlobaleEndroit(location._id);
								sendJsonResponse(res, 204, null);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "Aucuns commentaire à supprimer"
					});
				}
			}
		);
};
