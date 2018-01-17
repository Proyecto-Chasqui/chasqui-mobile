(function() {
	'use strict';

    angular.module('chasqui').factory('privateService', privateService);
    
    function privateService($http, $rootScope, LxNotificationService) {
        var privateService = {};
        var URL_BACKEND = "http://proyectochasqui.org:8080/chasqui-dev-testing";
        var header = {};

        privateService.refrescarHeader = function(){
            header = {headers: {'Authorization': $rootScope.globals.currentUser.authdata}};
        };

        privateService.obtenerNotificaciones = function(){
           return $http.get(URL_BACKEND+"/rest/user/adm/notificacion/1",header)
               .success(function(data){
                    return data;
            });
        };

        privateService.obtenerDatosPerfilUsuario = function(){
            return $http.get(URL_BACKEND+"/rest/user/adm/read", header)
                .success(function (data) {
                    return data;
            });
        };

        privateService.obtenerDireccionesDeUsuario = function(){
            return $http.get(URL_BACKEND+"/rest/user/adm/dir", header)
                .success(function(data) {
                   for (var i = 0; i < data.length; i++) {
                        data[i].alias_p = data[i].alias;
                    }
                });
        };

        privateService.guardarDireccion = function(direccion){
            var params = {
                            alias:direccion.alias,
                            altura:direccion.altura,
                            calle:direccion.calle,
                            predeterminada:direccion.predeterminada,
                            departamento:direccion.departamento,
                            localidad:direccion.localidad,
                            codigoPostal:direccion.codigoPostal
                        };
            $http.post(URL_BACKEND+"/rest/user/adm/dir", params, header)
                .success(function(data) { //Feedback de éxito
                        LxNotificationService.success("La dirección: "+direccion.alias+" se ha creado correctamente");
                 })
                .error(function(data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        };

        privateService.editarDireccion = function(direccion){
             var params = {
                            alias:direccion.alias,
                            altura:direccion.altura,
                            calle:direccion.calle,
                            predeterminada:direccion.predeterminada,
                            departamento:direccion.departamento,
                            localidad:direccion.localidad,
                            codigoPostal:direccion.codigoPostal,
                            idDireccion:direccion.idDireccion
                        };
            $http.put(URL_BACKEND+"/rest/user/adm/dir",params, header)
                .success(function(data) { //Feedback de éxito
                        LxNotificationService.success("La dirección: "+direccion.alias+" se ha actualizado correctamente");
                 })
                .error(function(data, status) { //Feedback de errores
                    if (status == 404 || status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        };

        privateService.eliminarDireccion = function(direccion){
            $http.delete(URL_BACKEND+"/rest/user/adm/dir/"+direccion.idDireccion,header)
                .success(function(data) { //Feedback de éxito
                    LxNotificationService.success("La dirección: "+direccion.alias+" se ha eliminado correctamente");
                 })
                .error(function(data, status) { //Feedback de errores
                    if (status == 404) {
                        LxNotificationService.error(data.error);
                    }
                });
        };

        privateService.editarPerfilUsuario = function(perfil){
            var param = {
                nickName : perfil.nickName,
                nombre: perfil.nombre,
                apellido: perfil.apellido,
                telefonoFijo: perfil.telefonoFijo,
                telefonoMovil: perfil.telefonoMovil,
                password: perfil.password
            };

            $http.put(URL_BACKEND+"/rest/user/adm/edit",param,header)
                .success(function(data) { //Feedback de éxito
                        LxNotificationService.success("Los datos de perfil se actualizaron correctamente");
                 })
                .error(function(data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        };

        privateService.obtenerPedidosVigentesIndividual = function(){
            return $http.get(URL_BACKEND+"/rest/user/pedido/individual/vigentes/", header)
                .success(function (data) {
                    return data;
                })
                .error(function (data, status) {
                    //Si no hay resultados, simplemente no habrán pedidos para visualizar.
                });
        };

        privateService.crearPedidoIndividual = function (idVendedor, callbackSuccess) {
            var body = {
                idVendedor: idVendedor
            }
            $http.post(URL_BACKEND+"/rest/user/pedido/individual/", body, header)
                .success(function (data, status) { //Feedback de éxito
                    if (status == 201) { //Pedido creado correctamente.
                        LxNotificationService.info("Pedido creado correctamente");
                        privateService.verPedidoActualIndividual(idVendedor, callbackSuccess);
                    }
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        };

        function completarURLsImagenesPedidoActual (data) {
            for (var i = 0; i < data.productosResponse.length; i++) {
                if(!(data.productosResponse[i].imagen === undefined || data.productosResponse[i].imagen === null)){
                    data.productosResponse[i].imagen = URL_BACKEND+data.productosResponse[i].imagen;
                }
            }
        };

        privateService.verPedidoActualIndividual = function (idVendedor, callbackSuccess, callbackError){
            $http.get(URL_BACKEND+"/rest/user/pedido/individual/"+idVendedor, header)
                .success(function (data) { //Feedback de éxito
                    completarURLsImagenesPedidoActual(data);
                    callbackSuccess (data);
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 404) { //Si no existe pedido vigente para el vendedor, se crea.
                        callbackError(data);
                    }
                });
        };

        privateService.agregarProductoAPedidoIndividual = function (idPedido, idVariante, cantidad, resetBadge){
            var body = {
                idPedido: idPedido,
                idVariante: idVariante,
                cantidad: cantidad
            }
            $http.put(URL_BACKEND+"/rest/user/pedido/individual/agregar-producto/", body, header)
                .success(function (data) { //Feedback de éxito
                    LxNotificationService.success(cantidad+" ítem/s agregado/s")
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 404 || status == 406) { //Feedback de errores
                        LxNotificationService.error(data.error);
                    }
            });
            resetBadge();
        };

        privateService.quitarProductoAPedidoIndividual = function (idPedido, idVariante, cantidad, resetBadge){
            var body = {
                idPedido: idPedido,
                idVariante: idVariante,
                cantidad: cantidad
            }
            $http.put(URL_BACKEND+"/rest/user/pedido/individual/eliminar-producto/", body, header)
                .success(function (data) { //Feddback de éxito
                    LxNotificationService.success(cantidad+" ítem/s eliminado/s")
                })
                .error(function (data, status) {
                    if (status == 406) { //Feedback de errores
                        LxNotificationService.error(data.error);
                    }
            });
            resetBadge();
        };

        privateService.confirmarPedidoIndividual = function (idPedido, idDireccion) {
            var body = {
                idPedido: idPedido,
                idDireccion: idDireccion
            }
            $http.post(URL_BACKEND+"/rest/user/pedido/individual/confirmar", body, header)
                .success(function (data, status) { //Feedback de éxito
                     LxNotificationService.success("El pedido ha sido confirmado");
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        };

        privateService.eliminarPedidoIndividual = function (idPedido, $index, refreshPantallaPedidos){
            $http.delete(URL_BACKEND+"/rest/user/pedido/individual/"+idPedido, header)
                .success(function (data, status) { //Feedback de éxito
                    LxNotificationService.success("El pedido ha sido cancelado");
                    refreshPantallaPedidos($index);
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
            });
        };

        privateService.obtenerGruposDe = function(idVendedor){
            return $http.get(URL_BACKEND+"/rest/user/gcc/all/"+idVendedor, header)
                .success(function (data) {
                    return data;
            });
        };

        privateService.crearGrupo = function(grupo, idVendedor, callbackSuccess, callbackError){
            var body = {
                alias: grupo.nombre,
                descripcion: grupo.descripcion,
                idVendedor: idVendedor
            }
            $http.post(URL_BACKEND+"/rest/user/gcc/alta/", body, header)
                .success(function(data){
                    callbackSuccess(data);
                }).error (function (response) {
                    callbackError(response);
                });
        };

        privateService.invitarUsuario = function(grupo, emailClienteInvitado, callbackSuccess, callbackError){
            var body = {
				idGrupo: grupo.idGrupo,
				emailInvitado: emailClienteInvitado
			}
            $http.post(URL_BACKEND+"/rest/user/gcc/invitacion/", body, header)
                .success(function(data){
                    callbackSuccess(data);
                }).error (function (response) {
                    callbackError(response);
                });
        };

        privateService.guardarEdicion = function(idGrupo, alias, descripcion, callbackSuccess, callbackError){
            var body = {
                alias: alias,
                descripcion: descripcion
            }
            $http.put(URL_BACKEND+"/rest/user/gcc/editarGCC/"+idGrupo, body, header)
                .success(function(data){
                    callbackSuccess(data);
                }).error (function (response) {
                    callbackError(response);
                });
        };

        privateService.quitarMiembro = function(idGrupo, emailMiembro, callbackSuccess, callbackError){
            var body = {
                idGrupo: idGrupo,
                emailCliente: emailMiembro
            }
            $http.post(URL_BACKEND+"/rest/user/gcc/quitarMiembro/", body, header)
                .success(function(data){
                    callbackSuccess(data);
                }).error (function (response) {
                    callbackError(response);
                });
        };

        privateService.aceptarInvitacion = function(idInvitacion, callbackSuccess, callbackError){
            var body = {
                idInvitacion: idInvitacion
            }
            $http.post(URL_BACKEND+"/rest/user/gcc/aceptar/", body, header)
                .success(function(data){
                    callbackSuccess(data);
                }).error (function (response) {
                    callbackError(response);
                });
        };

        privateService.rechazarInvitacion = function(idInvitacion, callbackSuccess, callbackError){
            var body = {
                idInvitacion: idInvitacion
            }
            $http.post(URL_BACKEND+"/rest/user/gcc/rechazar/", body, header)
                .success(function(data){
                    callbackSuccess(data);
                }).error (function (response) {
                    callbackError(response);
                });
        };

        privateService.agregarProductoACarritoGrupal = function (idGrupo, idVendedor, callbackAgregarProducto, pedidoYaCreado){
            $http.get(URL_BACKEND+"/rest/user/gcc/pedidos/"+idVendedor, header)
                .success(function (data) { //Consulta de pedidos grupales OK
                    var idPedidoGrupoVigente = null;
                    angular.forEach(data, function(pedido, index){
                        if (pedido.estado == 'ABIERTO' && pedido.idGrupo == idGrupo) {
                            idPedidoGrupoVigente = pedido.id;
                        }
                     });
                     if (idPedidoGrupoVigente != null) { //Agrego el producto al pedido vigente
                        callbackAgregarProducto(idPedidoGrupoVigente);
                     }
                     else {
                        if (!pedidoYaCreado) {
                            //Creo el pedido grupal (si no hay pedido con estado ABIERTO para el grupo dado)
                            privateService.crearPedidoGrupal(idGrupo, idVendedor, callbackAgregarProducto);
                        }else { //FIXME: Bug en BE donde entra en loop el crear pedido grupal.
                            /*Aparentemente, si ya tengo un pedido cancelado o confirmado para el grupo se buggea*/
                            LxNotificationService.error("Error en la creación del Pedido Grupal");
                        }
                     }
                })
                .error(function (data, status) { //Error en la consulta de pedidos grupales
                    //TODO: Según status, visualizar los feedbacks de error (provistos en data.error).
                    LxNotificationService.error("Error al agregar producto en carrito Grupal")
                });
        };

        privateService.crearPedidoGrupal = function (idGrupo, idVendedor, callbackAgregarProducto) {
            var body = {
                idVendedor: idVendedor,
                idGrupo: idGrupo
            }
            $http.post(URL_BACKEND+"/rest/user/gcc/individual", body, header)
                .success(function (data, status) { //Creación del predido grupal OK
                    if (status == 200) { //Pedido creado correctamente.
                        LxNotificationService.info("Pedido Grupal: Procesando...");
                        privateService.agregarProductoACarritoGrupal(idGrupo, idVendedor, callbackAgregarProducto, true);
                    }
                })
                .error(function (data, status) { //Error en la creación del pedido grupal
                    //TODO: Según status, visualizar los feedbacks de error (provistos en data.error).
                    LxNotificationService.error("Error en la creación del pedido grupal")
                });
        };

        privateService.obtenerPedidosVigentesGrupal = function (idVendedor){
            return $http.get(URL_BACKEND+"/rest/user/gcc/pedidos/"+idVendedor, header)
                .success(function (data) {
                    return data;
                })
                .error(function (data, status) {
                    //Si no hay resultados, simplemente no habrán pedidos para visualizar.
                });
        };

        privateService.verPedidoActualGrupal = function (idVendedor, idGrupo, callbackSuccess){
            $http.get(URL_BACKEND+"/rest/user/gcc/pedidos/"+idVendedor, header)
                .success(function (data) { //Feedback de éxito
                    var pedidoGrupal = {};
                    angular.forEach(data, function(pedido, index){
                        if (pedido.estado == 'ABIERTO' && pedido.idGrupo == idGrupo) {
                            pedidoGrupal = pedido;
                        }
                    });
                    completarURLsImagenesPedidoActual(pedidoGrupal);
                    callbackSuccess (pedidoGrupal);
                });
        };

        privateService.confirmarPedidoIndividualGcc = function (idPedido, idDireccion) {
            var body = {
                idPedido: idPedido
                //idDireccion: idDireccion TODO: ¿Se deberia incluir el id de la direccion?
            }
            $http.post(URL_BACKEND+"/rest/user/pedido/individualEnGrupo/confirmar", body, header)
                .success(function (data, status) { //Feedback de éxito
                     LxNotificationService.success("El pedido ha sido confirmado");
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        };

        return privateService;
    }
     
})();