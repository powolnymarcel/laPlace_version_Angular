
(function () {


angular
	.module('laPlaceApp')
	.service('laPlaceData', laPlaceData);
	//Injection pour eviter que lors de la minification le code ne se casse la figure
	laPlaceData.$inject = ['$http','authentificationService'];
function laPlaceData ($http,authentificationService) {
	var locationByCoords = function (lat, lng) {
		return $http.get('/api/endroits?lng=' + lng + '&lat=' + lat +
			'&maxDistance=20000000');
	};

	var endroitParid = function (endroitid) {
		return $http.get('/api/endroits/' + endroitid);
	};

	//Voir controlleur : "commentaireModalCtrl"
	var ajoutCommentaireParID = function (endroitid, data) {
		return $http.post('/api/endroits/' + endroitid + '/commentaires', data, {
			headers: {			Authorization: 'Bearer '+ authentificationService.getToken()
		}
		});
	};

	return {
		locationByCoords : locationByCoords,
		endroitParid: endroitParid,
		ajoutCommentaireParID:ajoutCommentaireParID
	};
}

})();
