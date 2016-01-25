(function () {
	angular
		.module('laPlaceApp')
		.controller('aProposCtrl', aProposCtrl);

	aProposCtrl.$inject = ['$scope'];

	function aProposCtrl ($scope) {
		var vm = this;
		$scope.toto= "tootoo";
		vm.headerDeLaPage = {
			titre: 'a PROPOS laPlace',
		};
		vm.principal = {
			contenu: 'laPlace BlaBlA BLA.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit.'
		};
	}

})();
