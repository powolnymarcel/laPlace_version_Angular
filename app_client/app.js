angular.module('laPlaceApp', ['ngRoute']);

function config ($routeProvider) {
	$routeProvider
		.when('/', {
			//Quand je rencontre '/' j'actionne le Ctrl accueilCtrl et j'envoie la vue accueil.view.html
			templateUrl: 'accueil/accueil.view.html',
			controller: 'accueilCtrl'
		})
		.otherwise({redirectTo: '/'});
}

angular
	.module('laPlaceApp')
	//Injection de la Fn config dans .config
	.config(['$routeProvider', config]);
