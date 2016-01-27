(function () {
	angular
		.module('laPlaceApp')
		.controller('endroitDetailsCtrl', endroitDetailsCtrl);
	//Le composant $uibModal vient de 'ui.bootstrap'
	// Voir : modal - https://angular-ui.github.io/bootstrap/
	endroitDetailsCtrl.$inject = ['$http','$routeParams','$location','$uibModal','laPlaceData','authentificationService','toastr'];

	function endroitDetailsCtrl ($http,$routeParams,$location,$uibModal,laPlaceData,authentificationService,toastr) {
		var vm = this;
		vm.endroitid = $routeParams.endroitid;
		vm.estLoggeDansLapp = authentificationService.estLoggeDansLapp();
		vm.lePathCourrant = $location.path();

vm.encours = authentificationService.utilisateurEnCours();

		vm.supprLeCom=function(idDuCommentaire){
			if(window.confirm('Etes-vous sur?')){
				console.log('id de endroit: '+$routeParams.endroitid);
				console.log('id du commentaire: '+idDuCommentaire);

				$http.delete('/api/endroits/'+$routeParams.endroitid+'/commentaires/' + idDuCommentaire, {headers: {	Authorization: 'Bearer '+ authentificationService.getToken()}}).then(
					function(response){
						toastr.success('Suppression effectuée avec succes','Suppression');

						laPlaceData.endroitParid(vm.endroitid)
							.success(function(data) {
								vm.data = { endroit: data };
								vm.data.endroit.commentaires=vm.data.endroit.commentaires;

							})
							.error(function (e) {
								console.log(e);
							});
					},
					function(response){
						console.log(response)
						toastr.error(response.data.message, 'Erreur');
					}
				);

			};

		};



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


		//Affichage d'une MODAL pour l'ajout de commentaires
		vm.popUpAjoutCommentaire = function () {
			//$uibModal vient de "https://angular-ui.github.io/bootstrap/" -> modal
			var uibModalInstance = $uibModal.open({
				//le template de la modal
				templateUrl: 'commun/vues/commentaireModal/commentaireModal.vue.html',
				//Le Ctrl de la modal
				controller: 'commentaireModalCtrl as vm',
				//Sera un objet envoyé au controlleur "commentaireModalCtrl", il contient nom et ID
				resolve : {
					endroitData : function () {
						return {
							endroitid : vm.endroitid,
							endroitNom : vm.data.endroit.nom
						};
					}
				}
			});
			//Après l'ajout du comm on push le nouveau comm dans le array "vm.data.endroit.commentaires"
			uibModalInstance.result.then(function (data) {
				vm.data.endroit.commentaires.push(data);
			});
		};
	}
})();

