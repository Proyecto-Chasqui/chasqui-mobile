(function() {
	'use strict';

    angular.module('chasqui').controller('InvitationsCtrl', InvitationsCtrl);

    function InvitationsCtrl ($scope, $state, notificaciones, LxNotificationService) {

        $scope.nss = notificaciones.data;

    }
    
})();