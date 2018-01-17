(function() {
	'use strict';

    angular.module('chasqui').controller('CategoriesCtrl', CategoriesCtrl);
        
    function CategoriesCtrl($scope, $timeout, $state, ionicMaterialInk, ionicMaterialMotion) {

        // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
        $scope.$on('ngLastRepeat.categorias',function(e) {
            $timeout(function(){
                ionicMaterialMotion.fadeSlideIn();
                ionicMaterialInk.displayEffect();
              },0); // No timeout delay necessary.
        });

        $scope.verProductos = function(categoria){
            var params = {
                           actividad: 'Categoria',
                           nombreCategoria: categoria.nombre,
                           idCategoria: categoria.idCategoria,
                           pagina: 0
                         }

            $state.go('menu.home.catalogo.productosByCategoria', params);
        }
    }
})();
