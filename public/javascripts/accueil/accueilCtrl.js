angular
	.module('laPlaceApp')
	.controller('accueilCtrl', accueilCtrl);

function accueilCtrl ($scope,laPlaceData,geolocalisation) {
	var vm = this;

	vm.headerDeLaPage = {
		titre: 'laPlace ',
		tagline: 'permet de trouver un etablissement pres de chez vous'
	};
	vm.sidebar = {
		contenu: "Cherchez un endroit ? laPlace est là pour vous."
	};
	vm.message = "Verification en cours de votre localisation";
	vm.getData = function (position) {
		var lat = position.coords.latitude,
			lng = position.coords.longitude;
		vm.message = "Recherche d'endroits proche en cours";
		laPlaceData.locationByCoords(lat, lng)
			.success(function(data) {
				vm.message = data.length > 0 ? "" : "Aucuns endroits trouvé pres de votre positiob";
				vm.data = { endroits: data };
			})
			.error(function (e) {
				vm.message = "Desole, quelque chose s'est mal passé.";
			});
	};
	vm.showError = function (error) {
		$scope.$apply(function() {
			vm.message = error.message;
		});
	};
	vm.noGeo = function () {
		$scope.$apply(function() {
			vm.message = "La geolocalisation n'est pas supportée par votre navigateur.";
		});
	};
	geolocalisation.getPosition(vm.getData,vm.showError,vm.noGeo);
}
