angular.module('miApp')
    .controller('ReservasController', ['$scope', '$http', function($scope, $http) {
        
        $scope.filas = {
            negocios: {},
            economica: {}
        };


        $scope.filasNegociosDesc = [];
        $scope.filasEconomicaDesc = [];


        //cargar asientos
        function cargarAsientos() {
            $http.get('http://localhost:3000/api/asiento') 
                .then(function(response) {
                    agruparAsientosPorFila(response.data);
                })
                .catch(function(error) {
                    console.error('Error al cargar asientos:', error);
                    alert('Error al cargar asientos. Revisa la consola de la API.');
                });
        }

        //agrupar lo asientos
        function agruparAsientosPorFila(asientos) {
            $scope.filas = { 
                negocios: {}, 
                economica: {} 
            };

            asientos.forEach(function(asiento) {
                //obtener solo la letra
                const fila = asiento.id_asiento.charAt(0);
                //si va a tener o no maleta
                asiento.maleta = false;
                asiento.seleccionado = false;
                
                if (asiento.categoria === 'Negocios') {
                    //crear la fila
                    if (!$scope.filas.negocios[fila]) {
                        $scope.filas.negocios[fila] = [];
                    }
                    //insertar en la fila
                    $scope.filas.negocios[fila].push(asiento);

                } else if (asiento.categoria === 'Economica') {
                    //crear la fila
                    if (!$scope.filas.economica[fila]) { 
                        $scope.filas.economica[fila] = [];
                    }
                    //insertar la fila
                    $scope.filas.economica[fila].push(asiento);
                }
            });

            //ordenar por fila
            function sortAsientos(filasObj) {
                for (const filaKey in filasObj) {
                    filasObj[filaKey].sort(function(a, b) {
                        //obtener el numero
                        const numA = parseInt(a.id_asiento.substring(1));
                        const numB = parseInt(b.id_asiento.substring(1));
                        //ordenar por numero
                        return numA - numB;
                    });
                }
            }
            
            //asientos ordenados
            sortAsientos($scope.filas.negocios);
            sortAsientos($scope.filas.economica);

            //asientos ordenado en forma descendente
            $scope.filasNegociosDesc = Object.keys($scope.filas.negocios).sort().reverse();
            $scope.filasEconomicaDesc = Object.keys($scope.filas.economica).sort().reverse();
        }

        

        //array para guardar los asientos seleccionados
        $scope.asientosSeleccionados = []; 
        //mensaje de error en caso de que no funcio
        $scope.errorReserva = '';

        $scope.seleccionarAsiento = function(asiento) {
            if (asiento.estado === 'Ocupado') {
                alert('Este asiento no se encuentra disponible.');
                return;
            }
            
            console.log('Seleccionado:', asiento);

            //verificar que no este seleccionado
            const index = $scope.asientosSeleccionados.indexOf(asiento);

            if (index > -1) {
                //deseleccionar 
                $scope.asientosSeleccionados.splice(index, 1);
                asiento.seleccionado = false;
            } else {
                //seleccionar
                $scope.asientosSeleccionados.push(asiento);
                asiento.seleccionado = true;
            }


        };

        //calcular total de reserva
        $scope.calcularTotal = function() {
            let total = 0;
            $scope.asientosSeleccionados.forEach(function(asiento) {
                total += parseFloat(asiento.precio);
            });
            return total.toFixed(2);
        };

        $scope.confirmarReserva = function() {
        $scope.errorReserva = '';
    
    if ($scope.asientosSeleccionados.length === 0) {
        $scope.errorReserva = "Seleccione un asiento.";
        return;
    }

    // 1. Obtener el token guardado
    const token = localStorage.getItem('userToken');
    if (!token) {
        alert('Sesión expirada.');
        window.location.href = 'index.html';
        return;
    }

    // 2. Preparar los datos que enviaremos
    const datosReserva = {
        asientos: $scope.asientosSeleccionados,
        total: $scope.calcularTotal()
    };

    //realizar la reserva
    $http({
        method: 'POST',
        url: 'http://localhost:3000/api/reservas',
        data: datosReserva,
        headers: {
            //enviar token
            'Authorization': 'Bearer ' + token
        }
    }).then(function(response) {
        
        alert('¡Reserva confirmada con éxito! ID de Reserva: ' + response.data.id_reserva);
        
        // limpiar todo
        $scope.asientosSeleccionados = [];
        //recargar con nuevos asientos ocupados
        cargarAsientos();

    }).catch(function(error) {

        console.error('Error al confirmar reserva:', error);
        $scope.errorReserva = error.data.message || 'Error desconocido al guardar.';
        
        if (error.status === 500) {
             alert('Error: ' + error.data.details + ' Recargando mapa de asientos.');
             cargarAsientos();
        }
    });
    };
    
    //cerrar sesión
        $scope.logout = function() {
            localStorage.removeItem('userToken');
            window.location.href = 'index.html';
        };

        
        cargarAsientos();
    }]);