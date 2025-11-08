angular.module('miApp')
    .controller('MisReservasController', ['$scope', '$http', function($scope, $http) {

        $scope.misReservas = [];
        $scope.vistaActual = 'listado';
        $scope.asientoAModificar = null;
        $scope.formData = {};
        $scope.errorModificacion = '';
        $scope.exitoModificacion = '';
        
        //obtener las reservas
        function cargarMisReservas() {
            const token = localStorage.getItem('userToken');
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/reservas/mis-reservas',
                headers: { 'Authorization': 'Bearer ' + token }
            }).then(function(response) {
                $scope.misReservas = response.data;
            }).catch(function(error) {
                console.error('Error al cargar mis reservas', error);
                $scope.errorModificacion = 'No se pudieron cargar tus reservas.';
            });
        }

        //cancelar asiento
        $scope.cancelarAsiento = function(asientoParaCancelar) {
            
            const confirmacion = confirm(`¿Está seguro que deseas cancelar el asiento ${asientoParaCancelar.id_asiento}?`);
            //no efectuar nada si el usuario dice no
            if (!confirmacion) {
                return; 
            }

            const token = localStorage.getItem('userToken');
            
            $http({
                method: 'DELETE',
                url: 'http://localhost:3000/api/reservas',
                
                data: { id_asiento: asientoParaCancelar.id_asiento },
                headers: { 
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            }).then(function(response) {
                
                alert(response.data.message);
                cargarMisReservas();
                

                if ($scope.asientoAModificar && $scope.asientoAModificar.id_asiento === asientoParaCancelar.id_asiento) {
                    $scope.cancelarModificacion();
                }

            }).catch(function(error) {
                console.error('Error al cancelar:', error);
                $scope.errorModificacion = error.data.message || 'Error al intentar cancelar.';
            });
        };

        $scope.iniciarModificacion = function(reserva) {
        $scope.asientoAModificar = reserva;
        $scope.vistaActual = 'modificar';
        $scope.formData.nuevoAsientoId = '';
        $scope.errorModificacion = '';
        $scope.exitoModificacion = '';
        };

        $scope.confirmarModificacion = function() {
          if (!$scope.formData.nuevoAsientoId || !$scope.asientoAModificar) {
            console.error("Faltan datos para modificar.");
            return;
          }

          const token = localStorage.getItem('userToken');
          const datos = {
            id_asiento_antiguo: $scope.asientoAModificar.id_asiento,
            id_asiento_nuevo: $scope.formData.nuevoAsientoId.toUpperCase()
          };

          $http({
            method: 'PUT',
            url: 'http://localhost:3000/api/reservas',
            data: datos,
            headers: { 'Authorization': 'Bearer ' + token }
          }).then(function(response) {
            $scope.exitoModificacion = response.data.message;
            $scope.errorModificacion = '';
            cargarMisReservas();
            setTimeout(function() {
              $scope.vistaActual = 'listado';
              $scope.asientoAModificar = null;
              $scope.$apply();
            }, 2000);
          }).catch(function(error) {
            $scope.errorModificacion = error.data.message;
            $scope.exitoModificacion = '';
          });
        };

        //cancelar modificación
        $scope.cancelarModificacion = function() {
        $scope.vistaActual = 'mapa';
        $scope.asientoAModificar = null;
        $scope.errorModificacion = '';
        $scope.exitoModificacion = '';
        window.location.href = 'mis-reservas.html';
        };

        //cerrar sesion
        $scope.logout = function() {
          localStorage.removeItem('userToken');
          window.location.href = 'index.html';
        };

        //actualizar las reservas
        cargarMisReservas();
    }
]);