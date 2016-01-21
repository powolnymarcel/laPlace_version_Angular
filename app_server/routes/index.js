//---------------
/*   Variables */
//---------------
//Declaration d'express
var express = require('express');
//Declaration du routeur d'express
var router = express.Router();
//Declaration du controleurs en charges pour les endroits
var ctrlEndroits = require('../controlleurs/endroits');
//Declaration du controleurs en charges pour les autres pages
var ctrlAutres = require('../controlleurs/autres');


//---------------
/*   ROUTAGE   */
//---------------
/**
 *
 * @description Routing pour les pages liées aux endroits
 *
 */
router.get('/', ctrlAutres.angularApp);
//router.get('/endroits/:endroitsid', ctrlEndroits.infoEndroit);
//router.get('/endroits/ajouter/ajout', ctrlEndroits.ajoutEndroit);
//router.get('/endroits/editer/:endroitsid', ctrlEndroits.editerEndroit);
//router.post('/endroits/editer/:endroitsid/fin', ctrlEndroits.editerEndroitFin);
////Au cas ou...
//router.get('/endroits/:endroitsid/commentaires', ctrlEndroits.infoEndroit);
////**
//router.get('/endroits/:endroitsid/commentaires/nouveau', ctrlEndroits.ajouterCommentaire);
//router.post('/endroits/:endroitsid/commentaires/nouveau', ctrlEndroits.actionAjouterCommentaire);
//
///**
// *
// * @description Routing pour les Autres pages
// *
// */
//router.get('/a-propos', ctrlAutres.aPropos);
module.exports = router;











































//   avec fn nommée
//		var homepageController = function (req, res) {
//			res.render('index', { title: 'Express' });
//		};
//		/* GET home page. */
//		router.get('/', homepageController);
//
//			PAREIL ci dessous:
//			mais avec fn anonyme
//		/* GET home page. */
//		router.get('/', function(req, res, next) {
//		  res.render('index', { title: 'Express' });
//		});

//		module.exports = router;
