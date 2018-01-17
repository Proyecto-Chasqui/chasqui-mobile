(function() {
	'use strict';

    angular.module('chasqui').controller('NotificationsCtrl', NotificationsCtrl);
        
    function NotificationsCtrl($scope, LxNotificationService, privateService, notificaciones) {

        $scope.notificaciones = notificaciones.data;

        $scope.aceptarInvitacion = function (notificacion) {
            privateService.aceptarInvitacion(notificacion.id,
                function(data){ //callbackSuccess
                LxNotificationService.success("Se ha aceptado la invitación al grupo!");
            }, function (response) { //callbackError
                LxNotificationService.error("Falló el aceptar la invitación al grupo");
            });
        }

        $scope.rechazarInvitacion = function (notificacion) {
            privateService.rechazarInvitacion(notificacion.id,
                function(data){ //callbackSuccess
                LxNotificationService.success("Se ha rechazado la invitación al grupo!");
            }, function (response) { //callbackError
                LxNotificationService.error("Falló el rechazar la invitación al grupo");
            });
        }
    }

})();
