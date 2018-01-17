(function() {
	'use strict';

    angular.module('chasqui').controller('MenuCtrl', MenuCtrl);
                                         
    function MenuCtrl($scope, $ionicPopover, privateService /*, datosPerfil*/) {
        
        $scope.isExpanded = true;
        $scope.hasHeaderFabLeft = true;
        //$scope.nombre = datosPerfil.data.nombre;
        //$scope.email = datosPerfil.data.email;
    }
    
})();