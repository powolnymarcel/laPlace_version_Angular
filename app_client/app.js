(function () {

	angular.module('laPlaceApp', ['ngRoute']);

	function config($routeProvider) {
		$routeProvider
			.when('/', {
				//Quand je rencontre '/' j'actionne le Ctrl accueilCtrl et j'envoie la vue accueil.view.html
				templateUrl: 'accueil/accueil.view.html',
				controller: 'accueilCtrl',
				//controlleur as ViewModel, le vm fonctionnera un peu comme un "this" du controlleur VOIR 9.3.3 getting mean
				controllerAs: 'vm'
			})
			.otherwise({redirectTo: '/'});
	}

	angular
		.module('laPlaceApp')
		//Injection de la Fn config dans .config
		.config(['$routeProvider', config]);
})();
