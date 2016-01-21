angular.module('laPlaceApp', ['ngRoute']);

function config ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'accueil/accueil.view.html',
			controller: 'accueilCtrl'
		})
		.otherwise({redirectTo: '/'});
};

angular
	.module('laPlaceApp')
	.config(['$routeProvider', config]);
