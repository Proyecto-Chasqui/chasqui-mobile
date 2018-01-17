(function() {
	'use strict';

    angular.module('chasqui').controller('CartCtrl', CartCtrl);
    
    function CartCtrl($scope, $stateParams, $ionicListDelegate, $ionicPopup, $timeout, $ionicActionSheet, $state, LxNotificationService, privateService) {

        $scope.idVendedor = $stateParams.idVendedor; //ID vendedor
        $scope.badge = -1;

        function refreshPedidoActual () {
            if ($stateParams.idGrupo) {
                privateService.verPedidoActualGrupal($scope.idVendedor, $stateParams.idGrupo, function (response) {
                    $scope.cart = response.productosResponse;
                    $scope.nombreVendedor = response.nombreVendedor;
                    $scope.montoActual = response.montoActual;
                    $scope.montoMinimo = response.montoMinimo;
                    $scope.idPedido = response.id;
                });
            }
            else {
                privateService.verPedidoActualIndividual($scope.idVendedor, function(response) {
                    $scope.cart = response.productosResponse;
                    $scope.nombreVendedor = response.nombreVendedor;
                    $scope.montoActual = response.montoActual;
                    $scope.montoMinimo = response.montoMinimo;
                    $scope.idPedido = response.id;
                }, angular.noop);
            }
        }

        refreshPedidoActual();

        function resetBadge (){
            $scope.badge = -1;
        }

        $scope.popupConfirmarEliminarProducto = function(producto, $index) {
            $scope.data = {}
            $ionicPopup.show({
              title: '¿Está seguro de eliminar el producto?',
              subTitle: producto.nombre+" ("+producto.cantidad+" ítem/s)",
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
                    privateService.quitarProductoAPedidoIndividual($scope.idPedido, producto.idVariante, producto.cantidad, resetBadge);
                    $timeout(function(){
                        refreshPedidoActual();
                    },2000);
                }
              }, function(err) {
                console.log('Err:', err);
              }, function(msg) {
                console.log('message:', msg);
              });
        };

        $scope.quitarProducto = function(producto, $index){
            $scope.popupConfirmarEliminarProducto(producto, $index);
            $ionicListDelegate.closeOptionButtons();
        }

        $scope.confirmarPedido = function () {
            $state.go('menu.home.catalogo.pedidos.cart.checkout', {idPedido: $scope.idPedido, idGrupo: $stateParams.idGrupo});
        }

        function removeProductToCart (producto, cantidad) {
            privateService.quitarProductoAPedidoIndividual($scope.idPedido, producto.idVariante, cantidad, resetBadge);
            $timeout(function(){
                refreshPedidoActual();
            },2000);
        }

        function addProductToCart (producto, cantidad){
            privateService.agregarProductoAPedidoIndividual($scope.idPedido, producto.idVariante, cantidad, resetBadge);
            $timeout(function(){
                refreshPedidoActual();
            },2000);
        };

        $scope.editarProducto = function(producto){
            $ionicListDelegate.closeOptionButtons();
            $scope.badge = producto.cantidad;
            $ionicActionSheet.show({
              titleText: "Editar "+producto.nombre,
              buttons: [
                { text: '<i class="icon ion-plus balanced"></i> Agregar'},
                { text: '<i class="icon ion-minus assertive"></i> Quitar' },
                { text: '<i class="icon ion-checkmark balanced"></i> Confirmar' },
              ],
              destructiveText: 'Cancelar',
              cancelText: 'Cancel',
              cancel: function() {
                resetBadge();
              },
              buttonClicked: function(index) {
                switch (index) {
                    case 0: //Agregar ítem
                        if ($scope.badge < 99) {
                            $scope.badge++;
                        }
                        else {
                            LxNotificationService.info("No se pueden agregar mas de 99 items del mismo producto");
                        }
                        break;
                    case 1: //Quitar ítem
                        if ($scope.badge > 0) {
                            $scope.badge--;
                        }
                        break;
                    case 2: //Confirmar
                        if ($scope.badge >= 0) {
                            var cantidad = Math.abs($scope.badge - producto.cantidad);
                            if ($scope.badge > producto.cantidad) {
                                addProductToCart(producto, cantidad);
                            }
                            else {
                                removeProductToCart(producto, cantidad)
                            }
                        }
                        return true;
                }
              },
              destructiveButtonClicked: function() {
                resetBadge();
                return true;
              }
            });
        };
    }
    
})();