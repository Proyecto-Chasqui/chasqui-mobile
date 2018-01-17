angular.module('chasqui', ['ionic', 'ngCordova','chasqui.services', 'ionic-material', 'ionMdInput', 'lumx'])

.run(function($ionicPlatform, $cordovaSQLite, $state, $ionicHistory, $ionicPopup, AuthenticationService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        // api key = AIzaSyAxfdNf4NOgVIaozY3TaEV0341rVQYUUCM
        // gcm = 320708593934
        if (window.cordova) {
          db = $cordovaSQLite.openDB({ name: "chasqui.db",iosDatabaseLocation:'default'}); //device
        }else{
          db = window.openDatabase("chasqui.db", '1', 'my', 1024 * 1024 * 100); // browser
        }
        AuthenticationService.setDB(db);
        $cordovaSQLite.execute(db,
        "CREATE TABLE IF NOT EXISTS USUARIO (TOKEN TEXT PRIMARY KEY, EMAIL TEXT, ID_USUARIO INTEGER, NICKNAME TEXT)");

        var query = "SELECT * FROM USUARIO";
        $cordovaSQLite.execute(db,query).then(function(result){
            if(result.rows.length > 0){
                var token = result.rows.item(0).TOKEN;
                var email = result.rows.item(0).EMAIL;
                var id = result.rows.item(0).ID_USUARIO;
                var nickname = result.rows.item(0).NICKNAME;
                AuthenticationService.SetCredentials(email, token,id, nickname);
            }
        });
    });
    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmar',
            template: "¿Salir de Chasqui?",
            cancelText: 'No',
            okText: 'Si'
        });
        confirmPopup.then(function (close) {
          if (close) {
            // there is no back view, so close the app instead
            ionic.Platform.exitApp();
          } // otherwise do nothing
        });
      }
      e.preventDefault();
      return false;
    }, 101);
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('loading', {
        url: '/loading',
        controller: 'LoadingCtrl',
        templateUrl: 'app/views/main/loading.tmpl.html'
    })

     .state('abstrac', {
        url: '/abstrac',
        abstract:true,
        templateUrl: 'app/views/administration/login.tmpl.html',
        controller: 'LoginCtrl'
    })

    .state('abstrac.login', {
        url: '/login',
        views: {
             'menuContent': {
                templateUrl: 'app/views/administration/login.tmpl.html',
                controller: 'LoginCtrl'
            }
        },
    })

    .state('singup',{
        url:'/singup',
        templateUrl: 'app/views/administration/perfil.tmpl.html',
        controller: 'SingUpCtrl'
    })          

    .state('menu', {
        url: '/menu',
        abstract:true,
        templateUrl: 'app/views/main/sideMenu/menu.tmpl.html',
        controller: 'MenuCtrl'/*,
        resolve: {
            datosPerfil : function(privateService){
                return privateService.obtenerDatosPerfilUsuario();
            }
        }*/
    })
    
    .state('menu.home',{
        url:'/home',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/main/home.tmpl.html',
                controller:'HomeCtrl'
            }
        },
        resolve:{
            vendedores : function(publicService){
                return publicService.obtenerVendedores();
            }
        }
    })

    .state('menu.perfil',{
        url:'/perfil',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/administration/perfil.tmpl.html',
                controller: 'PerfilCtrl'
            }
        },
         resolve: {
             datosPerfil : function(privateService){
                return privateService.obtenerDatosPerfilUsuario();
             }
         }
    })

    .state('menu.direcciones',{
        url:'/direcciones',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/administration/addresses.tmpl.html',
                controller:'AddressesCtrl'
            }
        },
        resolve:{
            direcciones : function(privateService){
                return privateService.obtenerDireccionesDeUsuario();
            }
        }
    })

    .state('menu.home.catalogo.pedidos.cart.checkout', {
        url: '/checkout',
        views: {
          'menuContent@menu': {
            templateUrl: 'app/views/cart/checkout.tmpl.html',
            controller : 'CheckoutCtrl'
          }
        },
        params:{
            idPedido: null,
            idGrupo: null
        },
        resolve:{
            direcciones : function(privateService){
                return privateService.obtenerDireccionesDeUsuario();
            }
        }
    })

    .state('menu.home.catalogo.pedidos.cart', {
        url: '/cart',
        views: {
          'menuContent@menu': {
            templateUrl: 'app/views/cart/cart.tmpl.html',
            controller : 'CartCtrl'
          }
        },
        params:{
            idVendedor: null,
            idGrupo: null
        }
    })

    .state('menu.home.catalogo.pedidos',{
        url:'/pedidos',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/cart/ordersByCatalog.tmpl.html',
                controller:'OrdersCtrl'
            }
        },
        params:{
            idVendedor: null,
        },
        resolve:{
            pedidosIndividuales: function(privateService){
                return privateService.obtenerPedidosVigentesIndividual();
            },
            pedidosGrupales: function(privateService, $stateParams){
                return privateService.obtenerPedidosVigentesGrupal($stateParams.idVendedor);
            }
        }
    })

    .state('menu.home.catalogo.invitaciones',{
        url:'/invitaciones',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/administration/invitations.tmpl.html',
                controller:'InvitationsCtrl'
            }
        },
        resolve:{
            notificaciones: function(privateService){
                return privateService.obtenerNotificaciones();
            }
        }
    })

    .state('menu.home.catalogo.gruposByCatalogo',{
        url:'/gruposByCatalogo',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/administration/groupsByCatalog.tmpl.html',
                controller:'GroupsByCatalogCtrl'
            }
        },
        params:{
            idVendedor: null,
            nombreVendedor: null
        },
        resolve:{
            gruposByCatalogo: function(privateService, $stateParams){
                return privateService.obtenerGruposDe($stateParams.idVendedor);
            }
        }
    })

    .state('menu.sellos',{
        url:'/sellos',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/main/sideMenu/stamps.tmpl.html',
                controller:'StampsCtrl'
            }
        },
        resolve:{
            medallas: function(publicService){
                return publicService.obtenerMedallas();
            }
        }
    })

    .state('menu.notificaciones',{
        url:'/notificaciones',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/administration/notifications.tmpl.html',
                controller:'NotificationsCtrl'
            }
        },
        resolve:{
            notificaciones: function(privateService){
                return privateService.obtenerNotificaciones();
            }
        }
    })

    .state('menu.home.catalogo' ,{
      url: '/catalogo',
      views: {
        'menuContent@menu':{
            templateUrl:'app/views/catalog/catalog.tmpl.html',
            controller:'CatalogCtrl'
        }
      },
      params:{
          idVendedor: null,
          nombreVendedor: null
      },
      resolve:{
          categorias: function(publicService, $stateParams){
              return publicService.obtenerCategoriasDe($stateParams.idVendedor);
          },
          productores: function(publicService, $stateParams){
              return publicService.obtenerProductoresDe($stateParams.idVendedor);
          },
          medallas: function(publicService){
              return publicService.obtenerMedallas();
          },
          destacados: function(publicService, $stateParams){
              return publicService.obtenerProductosDestacados($stateParams.idVendedor);
          }
      }
    })

    .state('menu.home.catalogo.productosByProductor',{
        url:'/productosByProductor',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/catalog/products.tmpl.html',
                controller:'ProductsCtrl'
            }
        },
        params:{
            actividad:null,
            idProductor:null,
            nombreProductor:null,
            pagina: null
        },
        resolve:{
            prods : function(publicService,$stateParams){
                return {filterBy : 'Productor'};
            }
        }
    })

    .state('menu.home.catalogo.productosByMedalla',{
        url:'/productosByProductor',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/catalog/products.tmpl.html',
                controller:'ProductsCtrl'
            }
        },
        params:{
            actividad: null,
            idMedalla: null,
            idVendedor: null,
            nombreMedalla: null,
            pagina: null
        },
        resolve:{
            prods : function(publicService,$stateParams){
                return {filterBy : 'Sello'};
            }
        }
    })

    .state('menu.home.infoProducto',{
        url:'/infoProducto',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/catalog/productInfo.tmpl.html',
                controller:'ProductInfoCtrl'
            }
        },
        params:{
           prod : null,
           actividad: null
        },
        resolve:{
            infoProducto : function(publicService,$stateParams){
                return publicService.obtenerImagenesDeProducto($stateParams.prod,$stateParams.actividad);
            }
        }
    })

    .state('menu.home.catalogo.productosByCategoria',{
        url:'/productosByCategoria',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/catalog/products.tmpl.html',
                controller:'ProductsCtrl'
            }
        },
        params:{
            actividad: null,
            idCategoria: null,
            nombreCategoria: null,
            pagina: null
        },
        resolve:{
            prods : function(publicService, $stateParams){
                return {filterBy : 'Categoria'};
            }
        }
    })

    .state('menu.about',{
        url:'/about',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/main/sideMenu/about.tmpl.html',
                controller:'AboutCtrl'
            }
        }
    })

    .state('menu.ayuda',{
        url:'/ayuda',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/main/sideMenu/help.tmpl.html',
                controller:'HelpCtrl'
            }
        }
    })

    .state('menu.ayuda.acercaDeChasqui',{
        url:'/acercaDeChasqui',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/main/sideMenu/aboutChasqui.tmpl.html',
                controller:'HelpCtrl'
            }
        }
    })

    .state('menu.ayuda.comoComprar',{
        url:'/comoComprar',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/main/sideMenu/howToBuy.tmpl.html',
                controller:'HelpCtrl'
            }
        }
    })

    .state('menu.ayuda.terminosYCondiciones',{
        url:'/terminosYCondiciones',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/main/sideMenu/termsAndConditions.tmpl.html',
                controller:'HelpCtrl'
            }
        }
    })

    .state('menu.ayuda.videoTutorial',{
        url:'/videoTutorial',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/main/sideMenu/videoTutorial.tmpl.html',
                controller:'HelpCtrl'
            }
        }
    })

    .state('menu.invitar',{
        url:'/invitar',
        views:{
            'menuContent@menu':{
                templateUrl:'app/views/main/sideMenu/invite.tmpl.html',
                controller:'InviteCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/loading');
    //$urlRouterProvider.otherwise('/menu/home');
})

//https://github.com/zachfitz/Ionic-Material/issues/43
.directive('ngLastRepeat', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngLastRepeat'+ (attr.ngLastRepeat ? '.'+attr.ngLastRepeat : ''));
                });
            }
        }
    };
})

.filter('isEmpty', [function() {
  return function(object) {
    return angular.equals({}, object);
  }
}])

;
