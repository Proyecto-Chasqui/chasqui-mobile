(function() {
	'use strict';

    angular.module('chasqui').controller('HomeCtrl', HomeCtrl);
   
    function HomeCtrl($scope, $timeout, $state, $ionicModal, ionicMaterialInk, ionicMaterialMotion, vendedores, LxNotificationService) {

    /* String undefined re-defined */
        if (typeof String.prototype.includes === 'undefined') {
            String.prototype.includes = function(it) {
                return this.indexOf(it) != -1;
            };
        }

        $scope.vss = vendedores.data;

        $scope.verCatalogo = function(vendedor){
            $state.go('menu.home.catalogo',{idVendedor:vendedor.id, nombreVendedor: vendedor.nombre});
        }

        $scope.verEntregas = function (vendedor){
             $scope.vendedor = vendedor;
             $ionicModal.fromTemplateUrl('app/views/main/delivery.tmpl.html', {
               scope: $scope,
               animation: 'animated ' + 'jackInTheBox',
               hideDelay: 920
             }).then(function(modal) {
               $scope.modal = modal;
               $scope.modal.show();
               $scope.hideModal = function(){
                 $scope.modal.hide();
                 $scope.modal.remove();
               }
             });
        };


        // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
        $scope.$on('ngLastRepeat.catalogos',function(e) {
            $timeout(function(){
                ionicMaterialMotion.fadeSlideInRight();
                ionicMaterialInk.displayEffect();
            },0); // No timeout delay necessary.
        });
    }
})();
