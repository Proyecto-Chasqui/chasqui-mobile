(function() {
	'use strict';

    angular.module('chasqui').controller('SingUpCtrl', SingUpCtrl);
   
    function SingUpCtrl($scope, publicService, $state, LxNotificationService) {

        $scope.esEdicionPerfil=false;
        $scope.perfil={};
        $scope.perfil_r={}
        $scope.perfil.nombre='';
        $scope.perfil.apellido='';
        $scope.perfil.email='';
        $scope.perfil.nickName='';
        $scope.perfil.telefonoFijo='';
        $scope.perfil.telefonoMovil='';
        $scope.perfil.password='';
        $scope.perfil_r.password='';

        $scope.nombreValido = function(){
            if($scope.perfil.nombre == undefined){
                return false;
            }
            return $scope.perfil.password !== '';
        };

        $scope.apellidoValido = function(){
            if($scope.perfil.apellido == undefined){
                return false;
            }
            return $scope.perfil.apellido !== '';
        };

        $scope.emailValido = function(){
            if($scope.perfil.email == undefined){
                return false;
            }
            return $scope.perfil.email !== '';
        };

        $scope.telefonoValido = function(){
            if($scope.perfil.telefonoFijo == undefined){
                return false;
            }
            return $scope.perfil.telefonoFijo !== '' && ($scope.perfil.telefonoFijo.match(/^[0-9]+$/) != null);
        };

        $scope.celularValido = function(){
            if($scope.perfil.telefonoMovil == undefined){
                return false;
            }
            return $scope.perfil.telefonoMovil !== '' && ($scope.perfil.telefonoMovil.match(/^[0-9]+$/) != null);
        };

        $scope.passwordValida = function(){
            if($scope.perfil.password == undefined){
                return false;
            }
            return $scope.perfil.password.length >= 8;
        };

        $scope.coincidenContrasenias = function(){
            return  $scope.perfil.password === $scope.perfil_r.password;
        };

        $scope.validarFormulario = function(){
            return  $scope.nombreValido() && $scope.apellidoValido
                        && $scope.emailValido() && $scope.telefonoValido
                        && $scope.celularValido && $scope.passwordValida()
                        && $scope.coincidenContrasenias();
        };

        $scope.guardar= function(){
            if($scope.validarFormulario()){
                publicService.registro($scope.perfil, function(data){
                    LxNotificationService.success("Su registro ha sido exitoso");
                    $state.go("menu.home");
                }, function (response) {
                    LxNotificationService.error(response.error)
                });
            }
        };
    }
                
})();