(function() {
	'use strict';

    angular.module('chasqui').controller('SideMenuCtrl', SideMenuCtrl);

    function SideMenuCtrl($scope, $state, $ionicPopup, AuthenticationService) {

        $scope.leftMenuItems = [
                {
                    "title":'Inicio',
                    //"icon": 'ion-close-circled',
                    "sref":"menu.home"
                },
                {
                    "title":"Mi Perfil",
                    //"icon": 'ion-person',
                    "sref":"menu.perfil"
                },
                {
                    "title":"Sellos",
                    //"icon": 'ion-close-circled',
                    "sref":"menu.sellos"
                },
                {
                    "title":"Notificaciones",
                    //"icon": 'ion-close-circled',
                    "sref":"menu.notificaciones"
                },
                {
                    "title":"Descubrí Chasqui",
                    //"icon": 'ion-close-circled',
                    "sref":"menu.about"
                },
                {
                    "title":"Ayuda",
                    //"icon": 'ion-close-circled',
                    "sref":"menu.ayuda"
                },
                {
                    "title":"Invitar amigos",
                    //"icon": 'ion-close-circled',
                    "sref":"menu.invitar"
                }
            ];

        $scope.desconectar = function(){
            $ionicPopup.show({
              title: '¿Desea cerrar su sesión?',
              scope: $scope,
              buttons: [
                { text: 'No',
                  onTap: function(e) {
                      return false;
                  }
                },
                {
                  text: '<b>Si</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    return true;
                  }
                },
              ]
              }).then(function(res) {
                if (res) {
                    AuthenticationService.BorrarCredenciales();
                    AuthenticationService.ClearCredentials();
                    $state.go('abstrac.login');
                }
              }, function(err) {
                console.log('Err:', err);
              }, function(msg) {
                console.log('message:', msg);
              });
        }

    }

})();