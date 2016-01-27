(function () {
	angular
		.module('laPlaceApp')
		.controller('enregistrementCtrl', enregistrementCtrl);
	enregistrementCtrl.$inject = ['$location','authentificationService'];
	function enregistrementCtrl($location, authentificationService) {
		var vm = this;
		vm.headerDeLaPage = {
			titre: 'Creer votre compte'
		};
		vm.informations = {
			nom : "",
			email : "",
			password : ""
		};
		//Permet un retour à la page précedente quand l'utilisateur a cliqué sur le lien enregistrement sur le site
		// Exemple de lien :/#enregistrement?page=/a-propos.
		vm.retourAlaPagePrecedente = $location.search().page || '/';

		//Fn d'envoie du formulaire enregistrement
		vm.envoyerLeFormulaireEnregistrement = function () {

			vm.erreursDansLeFormulaire = "";
			if (!vm.informations.nom || !vm.informations.email || !vm.informations.password) {
				vm.erreursDansLeFormulaire = "Tous les champs sont requis, veuillez essayer de nouveau.";
				return false;
			} else {
				vm.enregistrementEffectif();
			}
		};
		vm.enregistrementEffectif = function() {
			vm.erreursDansLeFormulaire = "";
			authentificationService
				.enregistrement(vm.informations)
				.error(function(err){
					vm.erreursDansLeFormulaire = err;
				})
				.then(function(){
					$location.search('page', null);
					$location.path(vm.retourAlaPagePrecedente);
				});


		};

	}
})();
