(function() {
	'use strict';

    angular.module('chasqui').controller('LoadingCtrl', LoadingCtrl);
                                         
    function LoadingCtrl($state, $timeout, AuthenticationService) {

        
        function redirect(){
            if(AuthenticationService.estaLogueado()){
                AuthenticationService.esTokenValido(function(respuesta){
                    if(respuesta){
                        $state.go('menu.home');
                    }else{
                         AuthenticationService.BorrarCredenciales();
                         $state.go('abstrac.login');
                    }
                })
            }else{
                AuthenticationService.BorrarCredenciales();
                $state.go('abstrac.login');
            }
        }

        $timeout(function(){
            $state.go('abstrac.login');
            //$state.go('menu.home');
            //redirect();
        },300);
    }
    
})();