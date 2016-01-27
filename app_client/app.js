(function () {
	angular.module('laPlaceApp', ['ngRoute','ngSanitize','ui.bootstrap','toastr']);

	function config($routeProvider, $locationProvider,toastrConfig) {
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
			.when('/enregistrement', {
				templateUrl: 'commun/authentification/enregistrement/enregistrement.view.html',
				controller: 'enregistrementCtrl',
				controllerAs: 'vm'
			})
			.when('/login', {
				templateUrl: 'commun/authentification/login/login.view.html',
				controller: 'loginCtrl',
				controllerAs: 'vm'
			})
			.when('/endroits/:endroitid', {
				templateUrl: 'commun/vues/endroitDetail/endroitDetails.vue.html',
				controller: 'endroitDetailsCtrl',
				controllerAs: 'vm'
			})
			.when('/endroits/editer/:endroitid', {
				templateUrl: 'commun/endroitEdit/endroitEdit.vue.html',
				controller: 'endroitEditCtrl',
				controllerAs: 'vm'
			})
			.otherwise({redirectTo: '/'});
		$locationProvider.html5Mode(true);

		//Config pour le module Toastr (messages flash)
		angular.extend(toastrConfig, {
			allowHtml: false,
			closeButton: false,
			closeHtml: '<button>&times;</button>',
			extendedTimeOut: 1000,
			maxOpened: 0,
			iconClasses: {
				error: 'toast-error',
				info: 'toast-info',
				success: 'toast-success',
				warning: 'toast-warning'
			},
			messageClass: 'toast-message',
			onHidden: null,
			onShown: null,
			onTap: null,
			progressBar: true,
			tapToDismiss: true,
			templates: {
				toast: 'directives/toast/toast.html',
				progressbar: 'directives/progressbar/progressbar.html'
			},
			timeOut: 5000,
			titleClass: 'toast-title',
			toastClass: 'toast'
		});
	}

	angular
		.module('laPlaceApp')
		//Injection de la Fn config dans .config
		.config(['$routeProvider','$locationProvider','toastrConfig', config]);
})();
