(function () {
	angular
		.module('laPlaceApp')
		.controller('commentaireModalCtrl', commentaireModalCtrl);
	//On injecte le resolve qui contient nom et ID et "laPlaceData" car le service a l'action "ajoutCommentaireParID"
	commentaireModalCtrl.$inject = ['$uibModalInstance','endroitData','laPlaceData','toastr'];
	function commentaireModalCtrl ($uibModalInstance,endroitData,laPlaceData,toastr) {
		var vm = this;
		//Donc vm (viewmodel) endroitData qui vient du resolve du CTRL "endroitDetailsCtrl" contiendra "endroitData.endroitNom " et endroitData.endroitid
		vm.endroitData=endroitData;

		//  ng-submit DU FORMULAIRE
		vm.envoyerFormulaire = function () {
			vm.formErreur = "";				console.log('arret ici')

			if(! vm.formData || !vm.formData.note || !vm.formData.texte) {
				vm.formErreur = "Tous les champs sont requis.";
				return false;
			} else {
				vm.ajoutCommentaireParID(vm.endroitData.endroitid, vm.formData);
			}
		};

		vm.ajoutCommentaireParID = function (endroitid, formData) {
			//Fait un POST gràce au service laPlaceData et à l'action ajoutCommentaireParID
			laPlaceData.ajoutCommentaireParID(endroitid, {
					note : formData.note,
					texte : formData.texte
				})
				.success(function (data) {
					//Si l'operation s'est bien passée on log + ferme la modal
					console.log("Message envoyé avec succes!");
					toastr.success('Message envoyé avec succes!', 'Succes');

					vm.modal.close(data);
				})
				.error(function (data) {
					vm.formError = "Commentaire non sauvé. erreur";
					toastr.error('Commentaire non sauvé. erreur', 'Error');

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
