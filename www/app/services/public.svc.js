(function() {
	'use strict';

    angular.module('chasqui').factory('publicService', publicService);
    
    function publicService($http, $rootScope, AuthenticationService, LxNotificationService) {
        var publicService = {};
        var URL_BACKEND = "http://proyectochasqui.org:8080/chasqui-dev-testing";

        publicService.registro = function(perfil, callbackSuccess, callbackError){
            $http.post(URL_BACKEND+"/rest/client/sso/singUp", perfil)
                .success(function(data){
                    AuthenticationService.SetCredentials(data.email, data.token, data.id, data.nickname);
                    callbackSuccess(data);
                }).error (function (response) {
                callbackError(response);
            });
        };

        publicService.resetPassword = function(email){
            $http.get(URL_BACKEND+"/rest/client/sso/resetPass/"+email)
                .success(function(data){
                    LxNotificationService.success("La nueva contraseña fue enviada a su email");
                })
                .error(function(data, status){
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        };

        publicService.obtenerVendedores = function(){
            return $http.get(URL_BACKEND+"/rest/client/vendedor/all")
                .success(function(data){
                    for (var i = 0; i < data.length; i++) {
                        if (!(data[i].imagen === undefined || data[i].imagen === null)){
                            data[i].imagen = URL_BACKEND+data[i].imagen;
                        }
                     }
                     return data;
                });
        };

        publicService.obtenerCategoriasDe = function(idVendedor){
            $rootScope.idvendedor = idVendedor;
            return $http.get(URL_BACKEND+"/rest/client/categoria/all/"+idVendedor)
                .success(function(data) {
                    data.idVendedor = idVendedor;
                    return data;
                })
                .error(function(data) { // Feedback de errores
                    return LxNotificationService.error(data.error);
            });
        };

        publicService.obtenerProductoresDe = function(idVendedor){
            $rootScope.idvendedor = idVendedor;
            return $http.get(URL_BACKEND+"/rest/client/productor/all/"+idVendedor)
                .success(function(data) {
                  for (var i = 0; i < data.length; i++) {
                        data[i].idVendedor = idVendedor;
                        if(!(data[i].pathImagen === undefined || data[i].pathImagen === null)){
                          data[i].pathImagen = URL_BACKEND+data[i].pathImagen;
                        }
                        if(!(data[i].medalla === undefined || data[i].medalla === null)){
                            data[i].medalla.pathImagen = URL_BACKEND+data[i].medalla.pathImagen;
                        }
                     }
                  return data;
                })
                .error(function(data) { //Feedback de errores
                    return LxNotificationService.error(data.error);
            });
        };

        publicService.obtenerMedallas = function(){
            return $http.get(URL_BACKEND+"/rest/client/medalla/all")
                .success(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        if(!(data[i].pathImagen === undefined || data[i].pathImagen === null)){
                          data[i].pathImagen = URL_BACKEND+data[i].pathImagen;
                        }
                    }
                });
        };

        var completarURLsImagenes = function (data){
            for (var i = 0; i < data.productos.length; i++) {
                if(!(data.productos[i].imagenPrincipal === undefined || data.productos[i].imagenPrincipal === null)){
                    data.productos[i].imagenPrincipal = URL_BACKEND+data.productos[i].imagenPrincipal;
                }
                if(!(data.productos[i].medallasProducto === undefined || data.productos[i].medallasProducto === null)){
                    for(var x =0; x < data.productos[i].medallasProducto.length; x++){
                        var prd = data.productos[i];
                        prd.medallasProducto[x].pathImagen = URL_BACKEND+prd.medallasProducto[x].pathImagen;
                    }
                }
                if(!(data.productos[i].medallasProductor === undefined || data.productos[i].medallasProductor === null)){
                    for(var x =0; x < data.productos[i].medallasProductor.length; x++){
                        var prd = data.productos[i];
                        prd.medallasProductor[x].pathImagen = URL_BACKEND+prd.medallasProductor[x].pathImagen;
                    }
                }
            }
        };

        publicService.obtenerProductosDeProductor = function(idProductor, nombreProductor, actividad, pagina){
            var postParams = {
                              pagina: pagina,
                              cantItems: 10,
                              precio: 'Down',
                              idProductor: idProductor
                             }
            return $http.post(URL_BACKEND+"/rest/client/producto/byProductor", postParams)
                .success(function(data) {
                    completarURLsImagenes(data);
                    data.actividad = actividad + ' -> ' + nombreProductor;
                });

        };

        publicService.obtenerProductosDeCategoria = function(idCategoria, nombreCategoria, actividad, pagina){
            var postParams = {
                              pagina: pagina,
                              cantItems: 10,
                              precio: 'Down',
                              idCategoria: idCategoria
                             }

            return $http.post(URL_BACKEND+"/rest/client/producto/byCategoria", postParams)
                .success(function(data) {
                    completarURLsImagenes(data);
                    data.actividad = actividad + ' -> ' + nombreCategoria;
                });
        };

        publicService.obtenerProductosDeMedalla = function(idMedalla, idVendedor, nombreMedalla, actividad, pagina){
            var postParams = {
                              pagina: pagina,
                              cantItems: 10,
                              precio: 'Down',
                              idMedalla: idMedalla,
                              idVendedor: idVendedor
                             }

            return $http.post(URL_BACKEND+"/rest/client/producto/byMedalla", postParams)
                .success(function(data) {
                    completarURLsImagenes(data);
                    data.actividad = actividad + ' -> ' + nombreMedalla;
                });
        };

        publicService.obtenerImagenesDeProducto = function(prod, actividad){
            return $http.get(URL_BACKEND+"/rest/client/producto/images/"+prod.idVariante)
                .success(function(data) {
                for (var i = 0; i < data.length; i++) {
                    if(!(data[i].path === undefined || data[i].path === null)){
                        data[i].path = URL_BACKEND+data[i].path;
                        data[i].prod = {prod:prod, actividad:actividad}
                    }
                }
            });
        };

        publicService.obtenerProductosDestacados = function(idVendedor){
            return $http.get(URL_BACKEND+"/rest/client/producto/destacados/"+idVendedor)
                .success(function(data) {
                    completarURLsImagenes(data);
                    data.actividad = "Destacados";
                });
        };

        publicService.obtenerProductosSinFiltro = function(idVendedor, pagina){
            var postParams = {
                              pagina: pagina,
                              cantItems: 10,
                              precio: 'Down',
                              idVendedor: idVendedor
                             }
            return $http.post(URL_BACKEND+"/rest/client/producto/sinFiltro",postParams)
                .success(function(data) {
                    completarURLsImagenes(data);
                });
        };



        return publicService;
    }
            
})();