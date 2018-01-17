(function() {
	'use strict';

    angular.module('chasqui').controller('AddressesCtrl', AddressesCtrl);
        
    function AddressesCtrl($scope, $timeout, ionicMaterialInk, ionicMaterialMotion, privateService, direcciones) {

        $scope.actividad = 'Perfil -> Direcciones';
        if(!$scope.actividad.includes('Direcciones')){
            $scope.actividad = $scope.actividad + ' -> Direcciones';
        }
        $scope.dss = direcciones.data;

        function buscarIndexDireccion(alias){
            for (var i = 0; i < $scope.dss.length; i++) {
                if($scope.dss[i].alias_p === alias){
                   return i;
                }
            }
            return null;
        };

        $scope.agregarDireccion = function(){
            var index = buscarIndexDireccion('Nueva Direccion');
            var direccion = $scope.dss[index];
            if(direccion === null || direccion === undefined){
                var nuevaDireccion = {alias_p:'Nueva Direccion',
                                      alias:undefined,
                                      altura:undefined,
                                      calle:undefined,
                                      predeterminada:false,
                                      departamento:undefined,
                                      localidad:undefined,
                                      codigoPostal:undefined,
                                      nuevaDireccion:true
                                    };
                $scope.dss.push(nuevaDireccion);
            }
        };

        $scope.codigoPostalValido = function(codigoPostal){
            if(codigoPostal== undefined){
                return false;
            }
            if(typeof codigoPostal === 'number'){
                return true;
            }
            return codigoPostal !== '' && (codigoPostal.match(/^[0-9]+$/) != null);
        };

        $scope.altValida = function(altura){
            if(altura == undefined){
                return false;
            }
            if(typeof altura === 'number'){
                return true;
            }
            return altura !== '' && (altura.match(/^[0-9]+$/) != null);
        };

        function validarCampo(valor){
            return valor !== undefined || valor !== '';
        }

        $scope.formularioValido = function(d){
            return validarCampo(d.alias_h) && validarCampo(d.altura)
                    && validarCampo(d.calle)
                    && validarCampo(d.departamento) && validarCampo(d.localidad)
                    && validarCampo(d.codigoPostal);
        }

        $scope.eliminarDireccion = function(alias_p){
            var index = buscarIndexDireccion(alias_p);
            var direccion = $scope.dss[index];
            privateService.eliminarDireccion(direccion);
            $scope.dss.splice(index,1);
        };

        $scope.algunoIncompleto = function(direccion){
            return !$scope.formularioValido(direccion);
        }

        $scope.editarDireccion = function(alias_p){
            var index = buscarIndexDireccion(alias_p);
            var direccion = $scope.dss[index];
            if(direccion.nuevaDireccion !== undefined && direccion.nuevaDireccion
                && $scope.formularioValido(direccion)){
                privateService.guardarDireccion(direccion);
                direccion.nuevaDireccion = false;
                direccion.alias_p = direccion.alias;
            }else if($scope.formularioValido){
                privateService.editarDireccion(direccion);
                direccion.alias_p = direccion.alias;
            }
            var html = this;
            html.profile.$setPristine();
        }

        $scope.toggleGroup = function(alias) {
            if ($scope.isGroupShown(alias)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = alias;
            }
        };

        $scope.isGroupShown = function(alias) {
            return $scope.shownGroup === alias;
        };

        // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
        $scope.$on('ngLastRepeat.direcciones',function(e) {
            $timeout(function(){
                ionicMaterialMotion.fadeSlideIn();
                ionicMaterialInk.displayEffect();
              },0); // No timeout delay necessary.
        });
    }

})();
