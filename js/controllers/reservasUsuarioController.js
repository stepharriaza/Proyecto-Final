angular.module('miApp')
  .controller('ReservasUsuarioController', ['$scope', '$http', function($scope, $http) {
    $scope.usuariosReservas = [];

    $http.get('http://localhost:3000/api/usuario/reservas')
      .then(function(response) {
        $scope.usuariosReservas = response.data;
      })
      .catch(function(error) {
        console.error('Error al obtener reservas por usuario:', error);
      });
  }]);