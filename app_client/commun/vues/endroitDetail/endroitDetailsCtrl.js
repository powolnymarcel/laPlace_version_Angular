(function () {
	angular
		.module('laPlaceApp')
		.controller('endroitDetailsCtrl', endroitDetailsCtrl);
	//Le composant $uibModal vient de 'ui.bootstrap'
	// Voir : modal - https://angular-ui.github.io/bootstrap/
	endroitDetailsCtrl.$inject = ['$routeParams','$uibModal','laPlaceData'];

	function endroitDetailsCtrl ($routeParams,$uibModal,laPlaceData) {
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

