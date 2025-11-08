
angular.module('miApp')
    .controller('LoginController', ['$scope', 'AuthService', function($scope, AuthService) {
        
        $scope.loginData = {};
        $scope.mensajeErrorLogin = '';
        $scope.mensajeExitoLogin = '';

        $scope.iniciarSesion = function() {
            
            $scope.mensajeErrorLogin = '';
            $scope.mensajeExitoLogin = '';

            AuthService.login($scope.loginData)
                .then(function(response) {

                    $scope.mensajeExitoLogin = response.data.message;
                    
                    // guardar el token
                    localStorage.setItem('userToken', response.data.token);
                    
                    //redireccionar
                    window.location.href = 'reservas.html';

                    //limpiar formulario
                    $scope.loginData = {};
                    $scope.loginForm.$setPristine();

                })
                .catch(function(error) {
                    $scope.mensajeErrorLogin = error.data ? error.data.message : 'Error al iniciar sesión.';
                    localStorage.removeItem('userToken'); 
                });
        };

        //cerrar sesion
        $scope.logout = function() {
            localStorage.removeItem('userToken');
            window.location.href = 'index.html';
        };

    }]);