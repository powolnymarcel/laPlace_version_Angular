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


		vm.popuAjoutCommentaire = function () {
			var uibModalInstance = $uibModal.open({
				templateUrl: 'commun/vues/commentaireModal/commentaireModal.vue.html',
				controller: 'commentaireModalCtrl as vm',
				//Sera un objet envoyé au controlleur commentaireModalCtrl, il contient nom et ID
				resolve : {
					endroitData : function () {
						return {
							endroitid : vm.endroitid,
							endroitNom : vm.data.endroit.nom
						};
					}
				}
			});
			uibModalInstance.result.then(function (data) {
				vm.data.endroit.commentaires.push(data);
			});
		};
	}
})();

