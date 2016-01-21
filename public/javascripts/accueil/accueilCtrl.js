angular
	.module('laPlaceApp')
	.controller('accueilCtrl', accueilCtrl);

function accueilCtrl ($scope) {
	$scope.headerDeLaPage = {
		titre: 'laPlace ',
		tagline: 'permet de trouver un etablissement pres de chez vous'
	};
	$scope.sidebar = {
		contenu: "Cherchez un endroit ? laPlace est là pour vous."
	};
}
