(function () {
	angular
		.module('laPlaceApp')
		.controller('endroitAjouterCtrl', endroitAjouterCtrl);
	//Le composant $uibModal vient de 'ui.bootstrap'
	// Voir : modal - https://angular-ui.github.io/bootstrap/
	endroitAjouterCtrl.$inject = ['$routeParams','laPlaceData','$http','toastr','authentificationService'];

	function endroitAjouterCtrl ($routeParams,laPlaceData,$http,toastr,authentificationService) {
		var vm = this;

		vm.ajouter=function(){

			var donnees={
				nom : vm.data.endroit.nom,
				adresse : vm.data.endroit.adresse,
				services : vm.data.endroit.services.toString(),
				coords : [parseFloat(vm.data.endroit.coords[0]), parseFloat(vm.data.endroit.coords[1])],
				heuresOuverture : [{
					jours: vm.data.endroit.heuresOuverture[0].jours,
					ouverture: vm.data.endroit.heuresOuverture[0].ouverture,
					fermeture: vm.data.endroit.heuresOuverture[0].fermeture,
					ferme: vm.data.endroit.heuresOuverture[0].ferme
				}, {
					jours: vm.data.endroit.heuresOuverture[1].jours,
					ouverture: vm.data.endroit.heuresOuverture[1].ouverture,
					fermeture: vm.data.endroit.heuresOuverture[1].fermeture,
					ferme: vm.data.endroit.heuresOuverture[1].ferme
				}]
			};
			console.log('****************************************');

			$http.post("api/endroits/",donnees, {headers: {	Authorization: 'Bearer '+ authentificationService.getToken()}})
				.then(
				function(response){
					console.log("Ajout succes")
					toastr.success('Ajout succes','Ajout');
					console.log(response);

				},
				function(response){
					console.log("Erreur")
					toastr.error('ErreurErreur', 'Erreur');
					console.log(response);

				}
			);

		}











	}
})();

