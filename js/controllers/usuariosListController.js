angular.module('miApp')
  .controller('UsuariosListController', ['$scope', '$http', function($scope, $http) {
    $scope.totalUsuarios = 0;
    $scope.usuarios = [];

    // Obtener cantidad
    $http.get('http://localhost:3000/api/usuario/cantidad')
      .then(function(response) {
        $scope.totalUsuarios = response.data.totalUsuarios;
      })
      .catch(function(error) {
        console.error('Error al obtener cantidad de usuarios:', error);
      });

    // Obtener lista
    $http.get('http://localhost:3000/api/usuario')
      .then(function(response) {
        $scope.usuarios = response.data;
      })
      .catch(function(error) {
        console.error('Error al obtener lista de usuarios:', error);
      });
  }]);