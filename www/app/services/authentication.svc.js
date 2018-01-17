(function() {
	'use strict';

    angular.module('chasqui').factory('AuthenticationService', AuthenticationService);
    
    function AuthenticationService($http, $rootScope,$cordovaSQLite,privateService) {
        var authentication = {};
        var URL_BACKEND = "http://proyectochasqui.org:8080/chasqui-dev-testing";
        var db = null;

        authentication.GuardarCredenciales = function(token, email, id, nickname){
            var query = "INSERT INTO USUARIO (TOKEN,EMAIL,ID_USUARIO,NICKNAME) VALUES (?,?,?,?)";
            var borrado = "DELETE FROM USUARIO";
            $cordovaSQLite.execute(db,borrado);
            $cordovaSQLite.execute(db,query,[token,email,id,nickname])
                .then(function(result){
                    console.log(result);
                },function(error){console.log(error)});
        };

        authentication.BorrarCredenciales = function(){
            var borrado = "DELETE FROM USUARIO";
            $cordovaSQLite.execute(db,borrado);
        };

        authentication.setDB = function(dataBase){
            db = dataBase;
        };

        authentication.esTokenValido = function(callback){
            var header = {headers: {'Authorization': $rootScope.globals.currentUser.authdata}}
            $http.get(URL_BACKEND+"/rest/user/adm/check", header)
                .success(function(data){
                    callback(true);
                })
                .error(function(data){
                    callback(false);
                });
        };

        authentication.estaLogueado = function(){
            return $rootScope.globals !== undefined && $rootScope.globals.currentUser !== undefined
                    && $rootScope.globals.currentUser.id !== undefined;
        };

        authentication.Login = function (username, password, callbackSucces, callbackError) {
            $http.post(URL_BACKEND+"/rest/client/sso/singIn", { email: username, password: password })
                .success(function (response) {
                    callbackSucces(response);
                })
                .error (function (response) {
                    callbackError(response);
                });
        };

        authentication.SetCredentials = function (email, token, id, nickname) {
            var authdata = btoa(email + ':' + token);
            $rootScope.globals = {
                currentUser: {
                    username: email,
                    authdata: 'Basic ' + authdata,
                    id: id,
                    nickname: nickname
                }
            };
            privateService.refrescarHeader();
        };

        authentication.ClearCredentials = function () {
            $rootScope.globals = {};
        };

        return authentication;
    }
        
})();