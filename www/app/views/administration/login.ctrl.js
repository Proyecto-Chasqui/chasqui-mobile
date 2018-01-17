(function() {
	'use strict';

    angular.module('chasqui').controller('LoginCtrl', LoginCtrl);
        
    function LoginCtrl($scope, $state, AuthenticationService, publicService, LxNotificationService){

        $scope.usuario = {
            email: "jk@jk.com",
            password: "juanchor93"
        };
        $scope.resetPassword = false;
        
        $scope.login = function () {
                AuthenticationService.Login($scope.usuario.email, $scope.usuario.password,
                function(response) {
                    console.log("login response", response);
                    AuthenticationService.SetCredentials($scope.usuario.email, response.token, response.id, response.nickname);
                    //AuthenticationService.GuardarCredenciales(response.token, $scope.usuario.email, response.id, response.nickname); TODO: averiguar que hace este metodo
                    $state.go("menu.home");
                },
                function (response) {
                LxNotificationService.error(response.error);
            });
        };

        $scope.singUp = function(){
            $state.go("app.singup");
        }

        $scope.showInput = function() {
            if ($scope.resetPassword) {
                $scope.resetPassword = false;
            }
            else {
                $scope.resetPassword = true;
            }
        }

        $scope.forgetPassword = function () {
            if ($scope.usuario.resetEmail) {
                publicService.resetPassword($scope.usuario.resetEmail);
                $scope.showInput();
            }
            else {
                LxNotificationService.info("Debe ingresar su email");
            }
        }
        
        $scope.login();
    }

})();
