(function (angular) {
    angular.module('ControlElectoralApp').controller('RegistroVotoCtrl', ['$scope', '$uibModal', 'APP', 'JuntaUserResource', 'Lista',
        function ($scope, $modal, constant, JuntaUserResource, Lista) {
            var ctrl = this;
            $scope.selectedJunta = null;
            $scope.votosBlancos = 0;
            $scope.votosNulos = 0;
            $scope.totalVotos = 0;
            $scope.votosValidos = 0;

            //return users
            JuntaUserResource.get({id_user: window.user._id}, function (response) {
                var juntasByUser = angular.fromJson(response);
                $scope.juntasByUserAsignado = juntasByUser.junta;
            }, function (errorResponse) {
                $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
            });

            $scope.changeJunta = function (junta) {
                $scope.juntaInformation = junta;
                $scope.genero = $scope.juntaInformation.gender === 'F' ? 'Mujeres' : 'Hombres';
                getListas();
            };

            getListas();
            function sum(votos) {
                $scope.totalVotos += $scope.votosBlancos + $scope.votosNulos + votos;
                if ($scope.totalVotos <= $scope.juntaInformation.empadronados) {
                    calculoDeVotos();
                } else {
                    alert('El número máximo permitido es de ' + $scope.juntaInformation.empadronados + ' votos');
                    calculoDeVotos();
                }
            }

            function calculoDeVotos() {
                $scope.totalVotos = 0;
                $scope.listas.forEach(function (item) {
                    $scope.totalVotos += item.votos;
                });
                $scope.totalVotos += $scope.votosBlancos + $scope.votosNulos
            }

            function getListas() {
                clearData();
                Lista.query({}, function (result) {
                    $scope.listas = result;
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            function saveVoto() {
                $('#deleteRegistroConfirmation').modal('show');
            }

            function clearData() {
                $scope.votosBlancos = 0;
                $scope.votosNulos = 0;
                $scope.totalVotos = 0;
            }

            ctrl.sum = sum;
            ctrl.saveVoto = saveVoto;

        }
    ]);
}(window.angular));