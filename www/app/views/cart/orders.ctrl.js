(function() {
	'use strict';

    angular.module('chasqui').controller('OrdersCtrl', OrdersCtrl);
    
    function OrdersCtrl($scope, $stateParams, $ionicPopup, $ionicListDelegate, $state, privateService, pedidosIndividuales, pedidosGrupales) {

        $scope.pedidosGrupales = [];
        $scope.pedidosIndividuales = [];

        angular.forEach(pedidosIndividuales.data, function(pedido, index){
            if (pedido.estado == 'ABIERTO' && pedido.idVendedor == $stateParams.idVendedor) {
                $scope.pedidosIndividuales.push(pedido);
            }
        });

        angular.forEach(pedidosGrupales.data, function(pedido, index){
            if (pedido.estado == 'ABIERTO') {
                $scope.pedidosGrupales.push(pedido);
            }
        });

        function refreshPantallaPedidosIndividual($index) {
            $scope.pedidosIndividuales.splice($index, 1);
        }

        function refreshPantallaPedidosGrupal($index) {
            $scope.pedidosGrupales.splice($index, 1);
        }

        $scope.showPopup = function(pedido, $index, refrescarPantalla) {
            $ionicPopup.show({
              title: '¿Está seguro de eliminar el pedido?',
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
                    privateService.eliminarPedidoIndividual(pedido.id, $index, refrescarPantalla);
                }
              }, function(err) {
                console.log('Err:', err);
              }, function(msg) {
                console.log('message:', msg);
              });
        };

        $scope.cancelarPedidoIndividual = function(pedido, $index){
            $scope.showPopup(pedido, $index, refreshPantallaPedidosIndividual);
        }

        $scope.cancelarPedidoGrupal = function(pedido, $index){
            $scope.showPopup(pedido, $index, refreshPantallaPedidosGrupal);
        }

        $scope.verCarritoIndividual = function (idVendedor){
            $state.go('menu.home.catalogo.pedidos.cart',{idVendedor:idVendedor});
        }

        $scope.verCarritoGrupal = function (idGrupo, idVendedor){
            $state.go('menu.home.catalogo.pedidos.cart',{idVendedor:idVendedor, idGrupo: idGrupo});
        }
    }
    
})();