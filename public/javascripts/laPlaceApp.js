angular.module('laPlaceApp', [])

var listingAccueilEndroitsCtrl = function ($scope) {
	$scope.data = {
		endroits: [{
			nom: 'Burger Queen',
			adresse: '125 High Street, Reading, RG6 1PS',
			note: 3,
			services: ['Hot drinks', 'Food', 'Premium wifi'],
			distance: '0.296456',
			_id: '5370a35f2536f6785f8dfb6a'
		},{
			nom: 'Costy',
			adresse: '125 High Street, Reading, RG6 1PS',
			note: 5,
			services: ['Hot drinks', 'Food', 'Alcoholic drinks'],
			distance: '0.7865456',
			_id: '5370a35f2536f6785f8dfb6a'
		},{
			nom: 'Cafe Hero',
			adresse: '125 High Street, Reading, RG6 1PS',
			note: 0,
			services: ['Hot drinks', 'Food', 'Premium wifi'],
			distance: '0.94561236',
			_id: '5370a35f2536f6785f8dfb6a'
		},{
			nom: 'Starcups',
			adresse: '125 High Street, Reading, RG6 1PS',
			note: 1,
			services: ['Hot drinks', 'Food', 'Cold drinks'],
			distance: '1.06548',
			_id: '5370a35f2536f6785f8dfb6a'
		},{
			nom: 'Simon\'s cafe',
			adresse: '125 High Street, Reading, RG6 1PS',
			note: 3,
			services: ['Hot drinks', 'Food', 'Premium wifi'],
			distance: '2.3654',
			_id: '5370a35f2536f6785f8dfb6a'
		},{
			nom: 'Sally\'s pub',
			adresse: '125 High Street, Reading, RG6 1PS',
			note: 5,
			services: ['Hot drinks', 'Food', 'Alcoholic drinks'],
			distance: '4.213654',
			_id: '5370a35f2536f6785f8dfb6a'
		}]};
};

var _isNumeric = function (n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};
var formatDistance = function () {
	return function (distance) {
		var numDistance, unit;
		if (distance && _isNumeric(distance)) {
			if (distance > 1) {
				numDistance = parseFloat(distance).toFixed(1);
				unit = 'km';
			} else {
				numDistance = parseInt(distance * 1000,10);
				unit = 'm';
			}
			return numDistance + unit;
		} else {
			return "?";
		}
	};
};

//---------------------------------------------------------------
/*                   directive "noteEtoilees"                  */
//---------------------------------------------------------------
//Ceci est la directive "noteEtoilees"
	//1	L'attribut "note" de la balise small recevra la note de l'endroit(1,2,3,4,5)
	//		comme si il existait une balise <note-etoilees note=3></note-etoilees> sauf que ici c'est un small avec 2 attr

	//2 small(note-etoilees, note="endroit.note")
	//3 Le scope "laNote" prendra la valeur de l'attribut "note"
	//4 Le scope est envoyé vers le fichier html "note-etoilees.html"
	//5 Affichage de la note grace à {{ laNote<5 ? '-empty' : ''}}
var noteEtoilees = function () {
	return {
		scope: {
			//=note indique à angular de chercher un attribut
			laNote : '=note'
		},
		templateUrl : "vues/note-etoilees.html"
	};
};













angular
	.module('laPlaceApp')
	//On nomme le Ctrl(1er param) et on l'injecte (2eme param)
	.controller('listingAccueilEndroitsCtrl', listingAccueilEndroitsCtrl)
	.filter('formatDistance', formatDistance)
	.directive('noteEtoilees', noteEtoilees);
