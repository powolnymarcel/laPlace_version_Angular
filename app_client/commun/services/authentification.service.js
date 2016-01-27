(function () {
	angular
		.module('laPlaceApp')
		.service('authentificationService', authentificationService);

	//Service pour la gestion du token dans la SPA
	authentificationService.$inject = ['$window'];
	function authentificationService ($window) {

		//Permet de sauvegarder le Token en localStorage
		var saveToken = function (token) {
			$window.localStorage['tokenPourLeSiteLaPlace'] = token;
		};
		//Permet de récuperer le token dans le localStorage
		var getToken = function () {
			return $window.localStorage['tokenPourLeSiteLaPlace'];
		};

		//Permet au service de s'occuper de l'enregistrement d'un nouvel utilisateur
		enregistrement = function(utilisateur) {
			return $http.post('/api/enregistrement', utilisateur).success(function(data){
				saveToken(data.token);
			});
		};
		//Permet au service de s'occuper du login d'un utilisateur
		login = function(utilisateur) {
			return $http.post('/api/login', utilisateur).success(function(data) {
				saveToken(data.token);
			});
		};
		//Permet au service de s'occuper du logout d'un utilisateur
		logout = function() {
			$window.localStorage.removeItem('tokenPourLeSiteLaPlace');
		};

		//Permet au service de verifier si l'utilisateur est loggé dans l'app.
		var estLoggeDansLapp = function() {
			var token = getToken();
			if(token){
				//Pemet de parcourir la partie non cryptée du token et verifie la date d'expiration
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return payload.exp > Date.now() / 1000;
			} else {
				return false;
			}
		};

		//Permet au service de recuperer les infos de l'utilisateur loggé
		var utilisateurEnCours = function() {
			//Si utilisateur loggé
			if(estLoggeDansLapp()){
				var token = getToken();
				//On split le JWT après le premier "." afin de récuperer le payload du token
				//Rappel : AAAA.BBBB.CCCC
				// -> AAAA = header du JWT(type + hashage)
				// -> BBBB = Payload du JWT (infos utiles)
				// -> CCCC = signature du JWT (cle secrete)
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return {
					email : payload.email,
					nom : payload.nom
				};
			}
		};

		return {
			saveToken : saveToken,
			getToken : getToken,
			enregistrement:enregistrement,
			login:login,
			utilisateurEnCours:utilisateurEnCours,
			estLoggeDansLapp:estLoggeDansLapp,
			logout:logout
		};




	}
})();
