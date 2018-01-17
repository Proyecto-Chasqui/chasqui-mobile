(function() {
	'use strict';

    angular.module('chasqui').controller('StampsCtrl', StampsCtrl);
    
    function StampsCtrl($scope, $sce, $timeout, ionicMaterialInk, ionicMaterialMotion, $ionicModal, medallas) {

        $scope.mss = medallas.data;

        // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
        $scope.$on('ngLastRepeat.medallas',function(e) {
            $timeout(function(){
                ionicMaterialMotion.fadeSlideIn();
                ionicMaterialInk.displayEffect();
              },0); // No timeout delay necessary.
        });

        $scope.renderHTML = function(html_code){
            return $sce.trustAsHtml(html_code);
        };

        $scope.verMedalla = function(m) {
          $scope.medalla = m;
          $ionicModal.fromTemplateUrl('app/views/main/sideMenu/stampInfo.tmpl.html', {
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
    }
    
})();