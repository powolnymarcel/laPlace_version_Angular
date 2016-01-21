angular
	.module('laPlaceApp')
	.service('laPlaceData', laPlaceData);
function laPlaceData ($http) {
	var locationByCoords = function (lat, lng) {
		return $http.get('/api/endroits?lng=' + lng + '&lat=' + lat +
			'&maxDistance=20000000');
	};
	return {
		locationByCoords : locationByCoords
	};
}