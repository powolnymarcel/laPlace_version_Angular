(function () {
angular
	.module('laPlaceApp')
	.directive('noteEtoilees', noteEtoilees);
function noteEtoilees () {
	return {
		restrict: 'EA',
		scope: {
			laNote : '=note'
		},
		templateUrl: '/commun/directives/noteEtoilees/note-etoilees.template.html'
	};
}
})();

