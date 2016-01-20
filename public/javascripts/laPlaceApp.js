
angular.module('laPlaceApp', []);
var listingAccueilEndroitsCtrl = function ($scope,laPlaceServiceAngularDonnees,geolocalisation) {
	$scope.message = "Verification de votre localisation en cours";
	$scope.recupererData = function (position) {
		var lat = position.coords.latitude,
			lng = position.coords.longitude;
		$scope.message = "Recherche en cours d'endroits proches...";
		$('.spinner').html("<img src='http://www.ondego.be/divers/spinner.gif'/>");
		laPlaceServiceAngularDonnees.localisationParCoordonnees(lat,lng)
			.success(function(data) {
				$('.spinner').hide();
				$scope.message = data.length > 0 ? "" : "Aucuns endroits trouvé...";
				$scope.data = { endroits: data };
			})
			.error(function (e) {
				$scope.message = "Desole mais quelque chose a mal fonctionné. ";
			});
	};
	$scope.montrerErreur = function (erreur) {
		$scope.$apply(function() {
			$scope.message = "Vous avez refusé la localisation.";
		});
	};
	$scope.pasDeGeolocalisation = function () {
		$scope.$apply(function() {
			$scope.message = "Geolocalisation non supportée ou desactivee.";
		});
	};
	geolocalisation.AvoirLaPositionDeUser($scope.recupererData,$scope.montrerErreur,$scope.pasDeGeolocalisation);
};
//-------------------------------------------------------------------------------------
/*                  	  Filtre pour formater la distance        	                 */
/*      			{{endroit.distance | formatDistance}}    		                 */
/*															                         */
/*	Ceci est le filtre AngularJS perso  "formatDistance"                             */
//-------------------------------------------------------------------------------------
var _estUnNombre = function (nombre) {
	return !isNaN(parseFloat(nombre)) && isFinite(nombre);
};
var formatDistance = function () {
	return function (distance) {
		var valeurDistance, unitee;
		//Si une distance est présente et elle est un nombre
		if (distance && _estUnNombre(distance)) {
			//Si la distance est supérieure à 1
			if (distance > 1) {
				//parseFloat la distance et arrondi à 1 nbt entier
				valeurDistance = parseFloat(distance).toFixed(1);
				unitee = 'km';
			} else {
				//Si distance est inférieure à 1 alors on arrondi pour avoir un nbr entier, multiplié par 1000
				//pour avoir des mètres, 10 pour base décimale 10
				// voir :https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/parseInt
				valeurDistance = parseInt(distance * 1000,10);
				unitee = 'm';
			}
			return valeurDistance + unitee;
		} else {
			return "?";
		}
	};
};

//-------------------------------------------------------------------------------------
/*                 			 Directive "noteEtoilees"                                */
/*      			<small note-etoilees note="endroit.note"></small>                */
/*                   						                                         */
/*															                         */
/*	Ceci est la directive "noteEtoilees"                                             */
/*	1	L'attribut "note" de la balise small recevra la note de l'endroit(1,2,3,4,5) */
/*			comme si il existait une balise <note-etoilees note=3></note-etoilees>	 */
/* 			sauf que ici c'est un small avec 2 attr                                  */
/*																					 */
/*																					 */
/*	2 small(note-etoilees, note="endroit.note")										 */
/*	3 Le scope "laNote" prendra la valeur de l'attribut "note" 						 */
/*	4 Le scope est envoyé vers le fichier html "note-etoilees.html"			    	 */
/*	5 Affichage de la note grace à {{ laNote<5 ? '-empty' : ''}}				     */
/*																					 */
/*																					 */
/*	Opertateur ternaire if-else	dans la vue note-etoilees.html	  					 */
/*  {{ laNote<1 ? '-empty' : ''}}" 													 */
/*  Si laNote est inférieure à 1 alors on ajoute '-empty' sinon on ajout rien   	 */
//-------------------------------------------------------------------------------------
var noteEtoilees = function () {
	return {
		scope: {
			//=note indique à angular de chercher un attribut
			laNote : '=note'
		},
		templateUrl : "vues/note-etoilees.html"
	};
};




//-------------------------------------------------------------------------------------
/*                  	  Service pour fetcher les données      	                 */
/*															                         */
//-------------------------------------------------------------------------------------
var laPlaceServiceAngularDonnees = function ($http) {
	var localisationParCoordonnees = function (lat, lng) {
		return $http.get('/api/endroits?lng=' + lng + '&lat=' + lat +
			'&maxDistance=20000000');
	};
	return {
		localisationParCoordonnees : localisationParCoordonnees
	};
};

//-------------------------------------------------------------------------------------
/*                  	  Service pour la geolocalisation  	    	                 */
/*															                         */
//-------------------------------------------------------------------------------------
var geolocalisation = function () {
	var RecupPosition = function (cbSuccess, cbError, cbNoGeo) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
		}
		else {
			cbNoGeo();
		}
	};
	return {
		AvoirLaPositionDeUser : RecupPosition
	};
};



angular
	.module('laPlaceApp')
	//On nomme le Ctrl(1er param) et on l'injecte (2eme param)
	.controller('listingAccueilEndroitsCtrl', listingAccueilEndroitsCtrl)
	.filter('formatDistance', formatDistance)
	.directive('noteEtoilees', noteEtoilees)
	.service('laPlaceServiceAngularDonnees', laPlaceServiceAngularDonnees)
	.service('geolocalisation', geolocalisation)
