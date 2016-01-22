(function () {
//-------------------------------------------------------------------------------------
	/*                  	  Filtre pour formater la distance        	                 */
	/*      			{{endroit.distance | formatDistance}}    		                 */
	/*															                         */
	/*	Ceci est le filtre AngularJS perso  "formatDistance"                             */
//-------------------------------------------------------------------------------------


	var _estUnNombre = function (nombre) {
		return !isNaN(parseFloat(nombre)) && isFinite(nombre);
	};
	var distanceFormatee = function () {
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
angular
	.module('laPlaceApp')
	.filter('distanceFormatee', distanceFormatee);

})();
