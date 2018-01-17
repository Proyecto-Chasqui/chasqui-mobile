(function() {
	'use strict';

    angular.module('chasqui').controller('ProductInfoCtrl', ProductInfoCtrl);
   
    function ProductInfoCtrl($scope, $sce, $timeout, $ionicModal, $ionicSlideBoxDelegate, infoProducto) {

        $scope.producto = infoProducto.data[0].prod.prod;
        $scope.actividad = infoProducto.data[0].prod.actividad;
        $scope.imagenes = infoProducto.data;

        if(!$scope.actividad.includes('Info Producto')){
            $scope.actividad = $scope.actividad + ' -> ' + $scope.producto.nombreProducto +' -> Info Producto';
        };

        $scope.renderHTML = function(html_code){
            return $sce.trustAsHtml(html_code);
        };

        $ionicModal.fromTemplateUrl('image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function() {
          $ionicSlideBoxDelegate.slide(0);
          $scope.modal.show();
        };

        $scope.closeModal = function() {
          $scope.modal.hide();
        };

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
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
            $scope.modal.show();
            $ionicSlideBoxDelegate.slide(index);
        }

        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };
    }
                
})();