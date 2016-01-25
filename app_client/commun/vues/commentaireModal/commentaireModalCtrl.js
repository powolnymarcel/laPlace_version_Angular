(function () {
	angular
		.module('laPlaceApp')
		.controller('commentaireModalCtrl', commentaireModalCtrl);
	//On injecte le resolve qui contien nom et ID
	commentaireModalCtrl.$inject = ['$uibModalInstance','endroitData','laPlaceData'];
	function commentaireModalCtrl ($uibModalInstance,endroitData,laPlaceData) {
		var vm = this;
		//Donc vm (viewmodel) endroitData qui vient du resolve du CTRL "endroitDetailsCtrl" contiendra "endroitData.endroitNom " et endroitData.endroitid
		vm.endroitData=endroitData;

		vm.envoyerFormulaire = function () {
			vm.formErreur = "";
			if(!vm.formData.nom || !vm.formData.note || !vm.formData.texte) {
				vm.formErreur = "Tous les champs sont requis.";
				return false;
			} else {
				vm.ajoutCommentaireParID(vm.endroitData.endroitid, vm.formData);
			}
		};

		vm.ajoutCommentaireParID = function (endroitid, formData) {
			laPlaceData.ajoutCommentaireParID(endroitid, {
					auteur : formData.nom,
					note : formData.note,
					texte : formData.texte
				})
				.success(function (data) {
					console.log("Success!");
					vm.modal.close(data);
				})
				.error(function (data) {
					vm.formError = "Commentaire non sauvé. erreur";
				});
			return false;
		};
		vm.modal = {
			close : function (result) {
				$uibModalInstance.close(result);
		},
			annuler : function () {
				$uibModalInstance.dismiss();
			}
		};
	}
})();
