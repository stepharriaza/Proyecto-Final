angular.module('miApp')
    .controller('RegisterController', ['$scope', 'AuthService', function($scope, AuthService) {
        
        $scope.usuario = {};
        $scope.mensajeError = '';
        $scope.mensajeExito = '';

        $scope.registrarUsuario = function() {
            
            if ($scope.registroForm.$invalid) {
                $scope.registroForm.$setSubmitted();
                return;
            }

            $scope.mensajeError = '';
            $scope.mensajeExito = '';

            //llama a la API
            AuthService.registrar($scope.usuario)
                .then(function(response) {
                    $scope.mensajeExito = response.data.message;
                    
                    window.location.href = 'login.html';
                    $scope.usuario = {};
                })
                .catch(function(error) {
                    $scope.mensajeError = error.data.message; 
                }
            );
        };
    }]);