angular.module('miApp')
  .controller('DiagramaAsientosController', ['$scope', '$http', function($scope, $http) {
    
    $scope.filas = { negocios: {}, economica: {} };
    $scope.filasNegociosDesc = [];
    $scope.filasEconomicaDesc = [];

    function agrupar(asientos) {
      $scope.filas = { negocios: {}, economica: {} };
        console.log('Filas negocios:', $scope.filas.negocios);
console.log('Filas económica:', $scope.filas.economica);

      asientos.forEach(function(asiento) {
        const fila = asiento.id_asiento.charAt(0);
        if (asiento.categoria === 'Negocios') {
          if (!$scope.filas.negocios[fila]) $scope.filas.negocios[fila] = [];
          $scope.filas.negocios[fila].push(asiento);
        } else if (asiento.categoria === 'Economica') {
          if (!$scope.filas.economica[fila]) $scope.filas.economica[fila] = [];
          $scope.filas.economica[fila].push(asiento);
        }
      });

      function ordenar(filasObj) {
        for (const fila in filasObj) {
          filasObj[fila].sort((a, b) => parseInt(a.id_asiento.slice(1)) - parseInt(b.id_asiento.slice(1)));
        }
      }

      ordenar($scope.filas.negocios);
      ordenar($scope.filas.economica);

      $scope.filasNegociosDesc = Object.keys($scope.filas.negocios).sort().reverse();
      $scope.filasEconomicaDesc = Object.keys($scope.filas.economica).sort().reverse();
    }

    $http.get('http://localhost:3000/api/asiento')
      .then(res => agrupar(res.data))
      .catch(err => console.error('Error al cargar asientos:', err));
  }]);