(function() {
	'use strict';

    angular.module('chasqui').controller('GroupsByCatalogCtrl', GroupsByCatalogCtrl);

    function GroupsByCatalogCtrl($scope, $state, $stateParams, $ionicModal, gruposByCatalogo, privateService, LxNotificationService) {

        $scope.gss = gruposByCatalogo.data;
        $scope.nombreVendedor = $stateParams.nombreVendedor;
        $scope.idVendedor = $stateParams.idVendedor;

        $scope.crearGrupoForm = function() {
          $scope.grupo = {};
          $ionicModal.fromTemplateUrl('app/views/administration/newGroup.tmpl.html', {
            scope: $scope,
            animation: 'animated ' + 'bounceIn',
            hideDelay: 920
          }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();

            $scope.hideModal = function(){
              $scope.modal.hide();
              $scope.modal.remove();
            };

            $scope.crearGrupo = function(){
                privateService.crearGrupo($scope.grupo, $stateParams.idVendedor, function(data){
                    LxNotificationService.success("Grupo creado con éxito!");
                    $scope.hideModal();
                    //$state.reload();
                }, function (response) {
                    LxNotificationService.error(response.error)
                });
            };
          });
        };

        $scope.administrarGrupo = function (g) {
            $scope.grupo = g;
            $ionicModal.fromTemplateUrl('app/views/administration/groupDetail.tmpl.html', {
              scope: $scope,
              animation: 'animated ' + 'slideInLeft',
              hideDelay: 920
            }).then(function(modal) {
              $scope.modal = modal;
              $scope.modal.show();

              $scope.hideModal = function(){
                $scope.modal.hide();
                $scope.modal.remove();
              };

              $scope.eliminarGrupo = function () {
                  LxNotificationService.info("En desarrollo");
              }

              $scope.invitarUsuario = function(){
                  privateService.invitarUsuario($scope.grupo, $scope.grupo.emailInvitar,
                      function(data){ //callbackSuccess
                      LxNotificationService.success("Se ha enviado la invitación!");
                      $scope.grupo.emailInvitar = '';
                  }, function (response) { //callbackError
                      LxNotificationService.error("Falló la invitación al email ingresado")
                  });
              };

              $scope.guardarEdicion = function(){
                  privateService.guardarEdicion($scope.grupo.idGrupo, $scope.grupo.alias, $scope.grupo.descripcion,
                     function(data){ //callbackSuccess
                      LxNotificationService.success("Se han guardado los cambios!");
                      $scope.editarGrupo();
                  }, function (response) { //callbackError
                      LxNotificationService.error("Falló el guardado de edición")
                  });
              };

              $scope.quitarMiembro = function(emailMiembro){
                  privateService.quitarMiembro($scope.grupo.idGrupo, emailMiembro,
                     function(data){ //callbackSuccess
                      LxNotificationService.success("Se ha quitado el usuario del grupo.");
                      $scope.editarGrupo();
                  }, function (response) { //callbackError
                      LxNotificationService.error("Falló al quitar miembro del grupo.")
                  });
              };

              $scope.cancelarInvitacion = function () {
                  $scope.grupo.emailInvitar = '';
                  $scope.invitarAGrupo();
              }

              $scope.cancelarEdicion = function () {
                  $scope.editarGrupo();
              }

              $scope.invitarAGrupo = function () {
                  $scope.invitarAGrupoShow = ($scope.invitarAGrupoShow ? false : true);
                  $scope.editarGrupoShow = false;
                  $scope.salirDelGrupoShow = false;
              }

              $scope.editarGrupo = function () {
                  $scope.editarGrupoShow = ($scope.editarGrupoShow ? false : true);
                  $scope.invitarAGrupoShow = false;
                  $scope.salirDelGrupoShow = false;
              }

              $scope.salirDelGrupo = function () {
                  $scope.salirDelGrupoShow = ($scope.salirDelGrupoShow ? false : true);
                  $scope.invitarAGrupoShow = false;
                  $scope.editarGrupoShow = false;
              }

            });
        }

    }
    
})();