(function () {
	angular
		.module('laPlaceApp')
		.controller('endroitEditCtrl', endroitEditCtrl);
	//Le composant $uibModal vient de 'ui.bootstrap'
	// Voir : modal - https://angular-ui.github.io/bootstrap/
	endroitEditCtrl.$inject = ['$routeParams','$location','laPlaceData','$http','toastr','authentificationService'];

	function endroitEditCtrl ($routeParams,$location,laPlaceData,$http,toastr,authentificationService) {



		var vm = this;
		vm.endroitid = $routeParams.endroitid;
		laPlaceData.endroitParid(vm.endroitid)
			.success(function(data) {
				vm.data = { endroit: data };
				vm.headerDeLaPage = {
					titre: vm.data.endroit.nom
				};
			})
			.error(function (e) {
				console.log(e);
			});


		vm.modifier=function(){
		//	$http.defaults.headers.put["Content-Type"] = "application/json";

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
			$http.put("api/endroits/"+$routeParams.endroitid,donnees, {headers: {	Authorization: 'Bearer '+ authentificationService.getToken()}})
				.success(function (data, status, headers) {
					console.log("successsuccesssuccesssuccesssuccesssuccessvv")
					toastr.success('Edition effectuée avec succes','Edition');
					console.log(data);
					vm.headerDeLaPage = {
						titre: vm.data.endroit.nom
					};
					$location.path('/endroits/'+data._id)
				})
				.error(function (data, status, header, config) {
					console.log("erererere")
					toastr.error('Your credentials are gone', 'Error');
				});
		}

		vm.supprimerEndroit=function(){

			if(window.confirm('Etes-vous sur?')){
				console.log('id de endroit: '+$routeParams.endroitid);

				$http.delete('/api/endroits/'+$routeParams.endroitid, {headers: {	Authorization: 'Bearer '+ authentificationService.getToken()}}).then(
					function(response){
						toastr.success('Suppression effectuée avec succes','Suppression');
						$location.path('/')

					},
					function(response){
						console.log(response)
						toastr.error(response.data.message, 'Erreur');
					}
				);

			};


		}





	}
})();

