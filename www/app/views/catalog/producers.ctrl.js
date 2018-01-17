(function() {
	'use strict';

    angular.module('chasqui').controller('ProducersCtrl', ProducersCtrl);
    
    function ProducersCtrl($scope, $timeout, $state, ionicMaterialInk, ionicMaterialMotion, $ionicModal) {

        // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
        $scope.$on('ngLastRepeat.productores',function(e) {
            $timeout(function(){
                ionicMaterialMotion.fadeSlideIn();
                ionicMaterialInk.displayEffect();
              },0); // No timeout delay necessary.
        });

        $scope.imagenValida = function(productor){
            return productor.pathImagen !== undefined && productor.pathImagen !== null;
        }

        $scope.verInfoProductor = function(p) {
          $scope.productor = p;
          $ionicModal.fromTemplateUrl('app/views/catalog/producerInfo.tmpl.html', {
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
          });
        };

        $scope.verProductos = function(productor){
            var params = {
                           actividad: 'Productor',
                           nombreProductor: productor.nombreProductor,
                           idProductor: productor.idProductor,
                           pagina: 0
                         }
            $state.go('menu.home.catalogo.productosByProductor',params);
        }
    }
    
})();