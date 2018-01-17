(function() {
	'use strict';

    angular.module('chasqui').controller('CheckoutCtrl', CheckoutCtrl);
    
    function CheckoutCtrl($scope, $timeout, $stateParams, $state, privateService, direcciones, $ionicPopup) {

        $scope.direccionSeleccionada = {};
        $scope.idPedido = $stateParams.idPedido;
        $scope.idGrupo = $stateParams.idGrupo;
        $scope.direcciones = direcciones.data;

        function setearDireccionPredeterminada () {
            angular.forEach($scope.direcciones, function(direccion) {
                if (direccion.predeterminada) {
                    $scope.direccionSeleccionada.id = direccion.idDireccion;
                    $scope.direccionSeleccionada.alias = direccion.alias;
                }
            });
        }

        setearDireccionPredeterminada();

        $scope.setearAlias = function (alias) {
            $scope.direccionSeleccionada.alias = alias;
        }

        $scope.popupConfirmarPedido = function() {
            $scope.data = {}
            $ionicPopup.show({
              title: '¿Desea confirmar el pedido?',
              subTitle: "El mismo será enviado a: "+$scope.direccionSeleccionada.alias,
              scope: $scope,
              buttons: [
                { text: 'No',
                  onTap: function(e) {
                      return false;
                  }
                },
                {
                  text: '<b>Si</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    return true;
                  }
                },
              ]
              }).then(function(res) {
                if (res) {
                    if ($scope.idGrupo) {
                        privateService.confirmarPedidoIndividualGcc($stateParams.idPedido, $scope.direccionSeleccionada.id);
                        $timeout(function(){
                            $state.go('menu.home')
                        },2000);
                    }else {
                        privateService.confirmarPedidoIndividual($stateParams.idPedido, $scope.direccionSeleccionada.id);
                        $timeout(function(){
                            $state.go('menu.home')
                        },2000);
                    }
                }
              }, function(err) {
                console.log('Err:', err);
              }, function(msg) {
                console.log('message:', msg);
              });
        };
    }
    
})();