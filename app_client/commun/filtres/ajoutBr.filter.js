(function () {
	angular
		.module('laPlaceApp')
		.filter('ajoutBr', ajoutBr);
	function ajoutBr () {
		return function (text) {
			var output = text.replace(/\n/g, '<br/>');
			return output;
		};
	}
})();
