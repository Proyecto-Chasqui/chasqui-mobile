(function() {
	'use strict';

    angular.module('chasqui').controller('StampsFilterCtrl', StampsFilterCtrl);
    
    function StampsFilterCtrl($scope, $rootScope, $sce, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicModal, $state) {

        // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
        $scope.$on('ngLastRepeat.medallasFilter',function(e) {
            $timeout(function(){
                ionicMaterialMotion.fadeSlideIn();
                ionicMaterialInk.displayEffect();
              },0); // No timeout delay necessary.
        });

        $scope.verProductos = function(medalla){
            var params = {
                           actividad: 'Sello',
                           nombreMedalla: medalla.nombre,
                           idMedalla: medalla.idMedalla,
                           idVendedor: $rootScope.idvendedor,
                           pagina: 0
                         }
            $state.go('menu.home.catalogo.productosByMedalla', params);
        }
    }
    
})();