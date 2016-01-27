(function () {
	angular
		.module('laPlaceApp')
		.controller('navigationCtrl', navigationCtrl);
	navigationCtrl.$inject = ['$location', 'authentificationService'];
	function navigationCtrl($location, authentificationService) {
		var vm = this;
		vm.lePathCourrant = $location.path();

		vm.estLoggeDansLapp = authentificationService.estLoggeDansLapp();
		vm.utilisateurEnCours = authentificationService.utilisateurEnCours();
		vm.logout = function() {
			authentificationService.logout();
			vm.estLoggeDansLapp = "";
			$location.path('/');
		};
	}
})();
