(function () {
	angular
		.module('laPlaceApp')
		.directive('navigation', navigation);
	function navigation () {
		return {
			restrict: 'EA',
			templateUrl: '/commun/directives/navigation/navigation.template.html',
			controller: 'navigationCtrl as navvm'
		};
	}
})();
