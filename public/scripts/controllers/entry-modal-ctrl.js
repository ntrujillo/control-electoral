(function (angular) {
    'use strict'

    angular.module('ControlElectoralApp').controller('EntryDialogCtrl', ['$scope', '$state', '$uibModalInstance', 'entity', 'Lista', 'Junta', 'Voto',
        function ($scope, $state, $modalInstance, entity, listas, junta, service) {
            var ctrl = this;

            var registro = {};
            $scope.selectedLista = null;
            $scope.votosBlancos = 0;
            $scope.votosNulos = 0;
            $scope.totalVotos = 0;
            $scope.votosValidos = 0;

            $scope.listListas = listas.query();


            // $scope.junta = junta.query({codeRecinto: entity.recinto, genero: entity.genero, numJunta: entity.junta});
            $scope.junta = junta.getJunta.get({
                id: entity.junta
            }, function (juntas) {
                var d = angular.fromJson(juntas);
            }, function (err) {
                console.err(err);
            });

            function clear() {
                $modalInstance.dismiss('cancel');
            };

            function sum(votos) {
                if (votos <= $scope.junta.NUM_EMPADR) {
                    $scope.totalVotos = 0;
                    $scope.listListas.forEach(function (item) {
                        $scope.totalVotos += item.votos;
                    });
                    $scope.totalVotos += $scope.votosBlancos + $scope.votosNulos;
                } else {
                    alert('El número máximo permitido es de ' + $scope.junta.NUM_EMPADR + ' votos');
                }
            }

            $scope.save = function () {
                if ($scope.totalVotos <= $scope.junta.NUM_EMPADR) {
                    registro.NULOS = $scope.votosNulos;
                    registro.BLANCOS = $scope.votosBlancos;
                    registro.TOTAL_VOTOS = $scope.totalVotos;
                    registro.VOT_VALIDOS = [];
                    $scope.listListas.forEach(function (item) {
                        var votosValido = {
                            NUM_VOTOS: item.votos,
                            LISTA: item._id
                        };
                        registro.VOT_VALIDOS.push(votosValido);
                    });
                    registro.JUNTA = $scope.junta;

                    service.SaveVoto.save(registro, onSaveFinished);
                } else {
                    alert('El número máximo permitido es de ' + $scope.junta.NUM_EMPADR + ' votos');
                }

            };

            function onSaveFinished(result) {
                $modalInstance.close(result);
            };


            ctrl.clear = clear;
            ctrl.entity = entity;
            ctrl.sum = sum;

        }]);


}(window.angular));