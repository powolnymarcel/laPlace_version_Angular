(function () {
	angular.module('laPlaceApp', ['ngRoute','ngSanitize','ui.bootstrap']);

	function config($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				//Quand je rencontre '/' j'actionne le Ctrl accueilCtrl et j'envoie la vue accueil.view.html
				templateUrl: 'accueil/accueil.view.html',
				controller: 'accueilCtrl',
				//controlleur as ViewModel, le vm fonctionnera un peu comme un "this" du controlleur VOIR 9.3.3 getting mean
				controllerAs: 'vm'
			})
			.when('/a-propos', {
				templateUrl: '/commun/vues/a-propos.vue.html',
				controller: 'aProposCtrl',
				controllerAs: 'vm'
			})
			.when('/endroits/:endroitid', {
				templateUrl: 'commun/vues/endroitDetail/endroitDetails.vue.html',
				controller: 'endroitDetailsCtrl',
				controllerAs: 'vm'
			})
			.otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(true);
	}

	angular
		.module('laPlaceApp')
		//Injection de la Fn config dans .config
		.config(['$routeProvider','$locationProvider', config]);
})();
