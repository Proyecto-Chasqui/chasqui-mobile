(function() {
	'use strict';

    angular.module('chasqui').controller('ProductsCtrl', ProductsCtrl);
    
    function ProductsCtrl($scope, $rootScope, $state, $stateParams, $ionicActionSheet, $ionicModal, $ionicSlideBoxDelegate, $sce, $ionicPopup, LxNotificationService, privateService, publicService, prods) {

        $scope.pss = []; //Lista de productos
        $scope.actividad = prods.filterBy; //Criterio de búsqueda
        $scope.idVendedor = $rootScope.idvendedor;
        $scope.nombreVendedor = $rootScope.nombreVendedor;

        function ejecutar(data){
            $scope.breadcrumb = data.actividad;
            if (data.productos.length > 0) {
                $scope.pss = $scope.pss.concat(data.productos);
                $scope.hayItems = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            else {
                $scope.hayItems = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        }

        $scope.loadMoreData = function() {
            $stateParams.pagina ++;
            if ($scope.actividad.includes('Productor')) {
                publicService.obtenerProductosDeProductor($stateParams.idProductor, $stateParams.nombreProductor, $stateParams.actividad, $stateParams.pagina)
                    .success(function(data){
                        ejecutar(data);
                    })
                    .error(function(data){
                        LxNotificationService.error('Error al obtener productos del productor '+$stateParams.nombreProductor);
                    })
            }
            else if ($scope.actividad.includes('Categoria')) {
                publicService.obtenerProductosDeCategoria($stateParams.idCategoria, $stateParams.nombreCategoria, $stateParams.actividad, $stateParams.pagina)
                    .success(function(data){
                        ejecutar(data);
                    })
                    .error(function(data){
                        LxNotificationService.error('Error al obtener productos de la categoria '+$stateParams.nombreCategoria);
                    })
            }else if ($scope.actividad.includes('Sello')) {
                publicService.obtenerProductosDeMedalla($stateParams.idMedalla, $stateParams.idVendedor, $stateParams.nombreMedalla, $stateParams.actividad, $stateParams.pagina)
                    .success(function(data){
                        ejecutar(data);
                    })
                    .error(function(data){
                        LxNotificationService.error('Error al obtener productos del sello '+$stateParams.nombreMedalla);
                    })
            }
        }

        $scope.$on('$stateChangeSuccess', function(){
            $scope.loadMoreData();
        });

        $scope.renderHTML = function(html_code){
            return $sce.trustAsHtml(html_code);
        };

        $scope.verInfoProducto = function(p) {
          $scope.producto = p;
          publicService.obtenerImagenesDeProducto(p, $scope.actividad)
          .success(function(data) {
              $scope.imagenes = data;
          });
          $ionicModal.fromTemplateUrl('app/views/catalog/productInfo.tmpl.html', {
            scope: $scope,
            animation: 'animated ' + 'bounceIn',
            hideDelay:920
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
            $scope.hideModal = function(){
              $scope.modal.hide();
              $scope.modal.remove();
            }

            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modalGaleria) {
                $scope.modalGaleria = modalGaleria;
            });

            $scope.openModal = function() {
              $ionicSlideBoxDelegate.slide(0);
              $scope.modalGaleria.show();
            };

            $scope.closeModal = function() {
              $scope.modalGaleria.hide();
            };

            // Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
              $scope.modalGaleria.remove();
            });

            // Execute action on hide modal
            $scope.$on('modal.hide', function() {
                // Execute action
            });

            // Execute action on remove modal
            $scope.$on('modal.removed', function() {
                // Execute action
            });

            $scope.$on('modal.shown', function() {
                // Modal is shown
            });

            // Call this functions if you need to manually control the slides
            $scope.next = function() {
                $ionicSlideBoxDelegate.next();
            };

            $scope.previous = function() {
                $ionicSlideBoxDelegate.previous();
            };

            $scope.goToSlide = function(index) {
                $scope.modalGaleria.show();
                $ionicSlideBoxDelegate.slide(index);
            }

            // Called each time the slide changes
            $scope.slideChanged = function(index) {
                $scope.slideIndex = index;
            };
          });
        };

        //--Inicio de funcionalidad de compra--
        function agregarProductoACarritoIndividual (p){
            privateService.verPedidoActualIndividual($scope.idVendedor,
                function(response) { //callbackSuccess
                    //Se agrega siempre 1 unidad. Para editar, desde el carrito.
                    privateService.agregarProductoAPedidoIndividual(response.id, p.idVariante, 1, angular.noop);
                },
                function(response){ //CallbackError
                    privateService.crearPedidoIndividual($scope.idVendedor, function(response) {
                        //Se agrega siempre 1 unidad. Para editar, desde el carrito.
                        privateService.agregarProductoAPedidoIndividual(response.id, p.idVariante, 1, angular.noop);
                    });
                });
        };

        function agregarProductoACarritoGrupal (p, idGrupo){
            privateService.agregarProductoACarritoGrupal(idGrupo, $stateParams.idVendedor,
                function(idPedido) { //callbackAgregarProducto
                    //Se agrega siempre 1 unidad. Para editar, desde el carrito.
                    privateService.agregarProductoAPedidoIndividual(idPedido, p.idVariante, 1, angular.noop);
                }, false);
        };

        $scope.comprar = function(p){
            $scope.title = p.nombreProducto +" "+ p.nombreVariedad;
            $scope.grupo = {};

            privateService.obtenerGruposDe($stateParams.idVendedor)
            .success(function(data) {
                $scope.gss = data;
            });

            $ionicModal.fromTemplateUrl('app/views/catalog/addToCart.tmpl.html', {
              scope: $scope,
              animation: 'animated ' + 'bounceIn',
              hideDelay:920
            }).then(function(modal) {
              $scope.modal = modal;
              $scope.modal.show();
              $scope.hideModal = function(){
                $scope.modal.hide();
                $scope.modal.remove();
              }

              //Esto se aplica para "recordar" el último tipo de compra elegido.
              if ($rootScope.tipoDeCompra != undefined && $rootScope.idVendedor == $stateParams.idVendedor) {
                  if ($rootScope.tipoDeCompra == 'INDIVIDUAL') {
                    confirmarCompraIndividual();
                  }
                  else { //$rootScope.tipoDeCompra == 'GRUPAL'
                    confirmarCompraGrupal();
                  }
              }

              function confirmarCompraIndividual() {
                  $ionicPopup.show({
                    title: '¿Confirmar producto para compra Individual?',
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
                          agregarProductoACarritoIndividual(p);
                          $rootScope.tipoDeCompra = 'INDIVIDUAL';
                          $rootScope.idVendedor = $stateParams.idVendedor;
                          $scope.hideModal();
                      }
                    }, function(err) {
                      console.log('Err:', err);
                    }, function(msg) {
                      console.log('message:', msg);
                    });
              }

              $scope.compraIndividual = function() {
                  $scope.compraIndividualSelected = !$scope.compraIndividualSelected;
                  $scope.compraGrupalSelected = false;
                  $scope.elegirGrupo = false;
                  confirmarCompraIndividual();
              }

              function confirmarCompraGrupal() {
                  $ionicPopup.show({
                    title: '¿Confirmar producto para compra Grupal?',
                    subTitle: $rootScope.grupoSeleccionado.alias,
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
                          agregarProductoACarritoGrupal(p, $rootScope.grupoSeleccionado.idGrupo);
                          $rootScope.tipoDeCompra = 'GRUPAL';
                          $rootScope.idVendedor = $stateParams.idVendedor;
                          $scope.hideModal();
                      }
                    }, function(err) {
                      console.log('Err:', err);
                    }, function(msg) {
                      console.log('message:', msg);
                    });
              }

              $scope.compraGrupal = function(){
                  $scope.compraGrupalSelected = !$scope.compraGrupalSelected;
                  $scope.compraIndividualSelected = false;
                  $scope.elegirGrupo = true;
              }

              $scope.grupoSeleccionado = function() {
                  $rootScope.grupoSeleccionado = angular.fromJson($scope.grupo.select);
                  confirmarCompraGrupal();
              }

            });
        };
        //--Fin de funcionalidad de compra--
    }
    
})();