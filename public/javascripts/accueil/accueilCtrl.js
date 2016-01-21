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
	vm.message = "Checking your location";
	vm.getData = function (position) {
		var lat = position.coords.latitude,
			lng = position.coords.longitude;
		vm.message = "Searching for nearby places";
		laPlaceData.locationByCoords(lat, lng)
			.success(function(data) {
				vm.message = data.length > 0 ? "" : "No locations found nearby";
				vm.data = { endroits: data };
			})
			.error(function (e) {
				vm.message = "Sorry, something's gone wrong";
			});
	};
	vm.showError = function (error) {
		$scope.$apply(function() {
			vm.message = error.message;
		});
	};
	vm.noGeo = function () {
		$scope.$apply(function() {
			vm.message = "Geolocation is not supported by this browser.";
		});
	};
	geolocalisation.getPosition(vm.getData,vm.showError,vm.noGeo);
}
