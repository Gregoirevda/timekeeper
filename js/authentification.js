(function(){
	
	var app = angular.module('Authentification', ['ngMaterial']);

	app.config(function($mdThemingProvider){
		$mdThemingProvider.theme('default')
			.primaryPalette('teal');
	});

	app.controller('LoginController', function(){

		this.email = null;
		this.password = null;

		this.submit = function(){
			console.log(this.email + " - " + this.password);
			window.location.href = 'timekeeper.html';
			/*
			$.ajax({
				type : 'POST',
				url : 'jkl.php',
				timeout : 3000,
				success : function(){

				},
				error : function(){
					alert("error");
				}
			});
			*/
		};

	}); //Controller Login

})(); //Global scope