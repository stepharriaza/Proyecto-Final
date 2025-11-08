angular.module('miApp')
    .factory('AuthService', ['$http', function($http) {
    
        const API_URL = 'http://localhost:3000/api/usuario'; 

        var servicio = {};

        //registrar
        servicio.registrar = function(datosUsuario) {
            return $http.post(API_URL + '/', datosUsuario); 
        };

        //inicio de sesion
        servicio.login = function(datosLogin) {
            return $http.post(API_URL + '/login', datosLogin);
        };

        return servicio;
    }]);