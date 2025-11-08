angular.module('miApp')
  .controller('ReservasListController', ['$scope', '$http', function($scope, $http) {
    $scope.reservas = [];

    function cargarReservas() {
      $http.get('http://localhost:3000/api/reservas')
        .then(function(response) {
          $scope.reservas = response.data;
        })
        .catch(function(error) {
          console.error('Error al cargar todas las reservas:', error);
        });
    }

    $scope.descargarXML = function() {
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<flightReservation>\n';

      $scope.reservas.forEach(function(res) {
        xml += `  <flightSeat>\n`;
        xml += `    <seatNumber>${res.seatNumber}</seatNumber>\n`;
        xml += `    <reservedBy>${res.reservedBy}</reservedBy>\n`;
        xml += `    <user>${res.user}</user>\n`;
        xml += `    <idNumber>${res.idNumber}</idNumber>\n`;
        xml += `    <hasLuggage>${res.hasLuggage}</hasLuggage>\n`;
        xml += `    <reservationDate>${res.reservationDate}</reservationDate>\n`;
        xml += `  </flightSeat>\n`;
      });

      xml += '</flightReservation>';

      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reservas.xml';
      a.click();
      URL.revokeObjectURL(url);
    };

    cargarReservas();
  }]);