
(function () {


angular
	.module('laPlaceApp')
	.service('laPlaceData', laPlaceData);
	//Injection pour eviter que lors de la minification le code ne se casse la figure
	laPlaceData.$inject = ['$http'];
function laPlaceData ($http) {
	var locationByCoords = function (lat, lng) {
		return $http.get('/api/endroits?lng=' + lng + '&lat=' + lat +
			'&maxDistance=20000000');
	};
	return {
		locationByCoords : locationByCoords
	};
}

})();
