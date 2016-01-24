(function () {
	angular
		.module('laPlaceApp')
		.directive('footerGenerique', footerGenerique);
	function footerGenerique () {
		return {
			restrict: 'EA',
			templateUrl: '/commun/directives/footerGenerique/footerGenerique.template.html'
	};
	}
})();
