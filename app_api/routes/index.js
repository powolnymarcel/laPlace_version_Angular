var express = require('express');
var router = express.Router();

//Permet de faire des restrictions sur les routes
var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.JWT_SECRET,
	//Les infos utilisateurs sont dans la partie payload du JWT, lue par express-jwt
	userProperty: 'payload'
});

var ctrlEndroits = require('../controlleurs/endroits');
var ctrlCommentaires = require('../controlleurs/commentaires');
//Ctrl d'authentification
var ctrlAuth = require('../controlleurs/authentification');
/*Rappel : app.use('/api', routesApi);*/
// Donc, les url commencent par /api/

//---------------------------------------------------------------
/*                 Routes ENDROITS                             */
//---------------------------------------------------------------
router.get('/endroits', ctrlEndroits.endroitsListeParDistance);
router.post('/endroits',auth, ctrlEndroits.creationEndroit);
router.get('/endroits/:endroitsid', ctrlEndroits.endroitsVoir);
router.put('/endroits/:endroitsid',auth, ctrlEndroits.endroitsUpdate);
router.delete('/endroits/:endroitsid',auth, ctrlEndroits.endroitsDelete);

//---------------------------------------------------------------
/*                 Routes COMMENTAIRES                         */
//---------------------------------------------------------------
router.post('/endroits/:endroitsid/commentaires',auth, ctrlCommentaires.creationCommentaire);
router.get('/endroits/:endroitsid/commentaires/:commentairesid', ctrlCommentaires.commentaireVoir);
router.put('/endroits/:endroitsid/commentaires/:commentairesid',auth, ctrlCommentaires.commentaireUpdate);
router.delete('/endroits/:endroitsid/commentaires/:commentairesid',auth, ctrlCommentaires.commentaireDelete);


//---------------------------------------------------------------
/*             Routes Authentification                         */
//---------------------------------------------------------------
router.post('/enregistrement', ctrlAuth.enregistrement);
router.post('/login', ctrlAuth.login);

module.exports = router;


