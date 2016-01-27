angular
	.module('laPlaceApp')
	.controller('loginCtrl', loginCtrl);
loginCtrl.$inject = ['$location','authentificationService'];
function loginCtrl($location, authentificationService) {
	var vm = this;
	vm.headerDeLaPage = {
		titre: 'Connexion à laPLace'
	};
	vm.informations = {
		email : "",
		password : ""
	};
	vm.retourAlaPagePrecedente = $location.search().page || '/';
	vm.envoyerLeFormulaireEnregistrement = function () {
		vm.erreursDansLeFormulaire = "";
		if (!vm.informations.email || !vm.informations.password) {
			vm.erreursDansLeFormulaire = "Tous les champs sont requis, veuillez essayer de nouveau.";
			return false;
		} else {
			vm.loginEffectif();
		}
	};
	vm.loginEffectif = function() {
		vm.erreursDansLeFormulaire = "";
		authentificationService
			.login(vm.informations)
			.error(function(err){
				vm.erreursDansLeFormulaire = err;
			})
			.then(function(){
				$location.search('page', null);
				$location.path(vm.retourAlaPagePrecedente);
			});
	};
}
