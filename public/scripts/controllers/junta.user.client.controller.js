(function (angular) {
    angular.module('ControlElectoralApp').controller('RegistroVotoCtrl', ['$scope', '$uibModal', 'APP', 'JuntaUserResource', 'Lista', 'Voto',
        function ($scope, $modal, constant, JuntaUserResource, Lista, serviceVoto) {
            var ctrl = this;
            var registro = {};
            var juntaObject = {};
            $scope.selectedJunta = null;
            $scope.votosBlancos = 0;
            $scope.votosNulos = 0;
            $scope.totalVotos = 0;
            $scope.votosValidos = 0;

            function resetModel(model) {
                switch (model) {
                    case 'votosBlancos':
                        $scope.votosBlancos = 0;
                        break;
                    case 'votosNulos':
                        $scope.votosNulos = 0;
                        break;
                    default :
                        model.votos = 0;
                        break;
                }
            }

            juntasOfUserAsignado();

            function juntasOfUserAsignado() {
                JuntaUserResource.get({id_user: window.user._id}, function (response) {
                    var juntasByUser = angular.fromJson(response);
                    $scope.juntasByUserAsignado = juntasByUser.junta;
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            $scope.changeJunta = function (junta) {
                $scope.juntaInformation = junta;
                $scope.genero = $scope.juntaInformation.gender === 'F' ? 'Mujeres' : 'Hombres';
                if ($scope.juntaInformation.status === 'VR') {
                    serviceVoto.get({idJunta: $scope.juntaInformation._id}, function (response) {
                        $scope.votosBlancos = response.BLANCOS;
                        $scope.votosNulos = response.NULOS;
                        $scope.totalVotos = response.TOTAL_VOTOS;
                        $scope.listas.forEach(function (lista, index) {
                            response.VOT_VALIDOS.forEach(function (votoLista) {
                                if (votoLista.LISTA === lista._id) {
                                    $scope.listas[index].votos = votoLista.NUM_VOTOS;
                                }
                            });
                        });

                    }, function (err) {
                        console.log(err);
                    });
                    $scope.estaVotoRegistrado = true;
                } else {
                    $scope.estaVotoRegistrado = false;
                    getListas();
                }
            };

            getListas();
            function sum(model) {
                calculoDeVotos();
                var temporalVotos = $scope.totalVotos;
                if (temporalVotos <= $scope.juntaInformation.empadronados) {
                    calculoDeVotos();
                } else {
                    resetModel(model);
                    calculoDeVotos();
                    errorVotosPermitidos();
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

            function errorVotosPermitidos() {
                $('#modalTotalVotosPermitidos').modal('show');
            }

            function saveModalVoto() {
                $('#saveVotos').modal('show');
            }

            function clearData() {
                $scope.votosBlancos = 0;
                $scope.votosNulos = 0;
                $scope.totalVotos = 0;
            }

            $scope.saveVoto = function () {
                console.log('juntaInformation', $scope.juntaInformation);
                registro.NULOS = $scope.votosNulos;
                registro.BLANCOS = $scope.votosBlancos;
                registro.TOTAL_VOTOS = $scope.totalVotos;
                registro.VOT_VALIDOS = [];
                $scope.listas.forEach(function (item) {
                    var votosValido = {
                        NUM_VOTOS: item.votos,
                        LISTA: item._id
                    };
                    registro.VOT_VALIDOS.push(votosValido);
                });
                juntaObject = {
                    _id: $scope.juntaInformation._id,
                    recinto: {
                        _id: $scope.juntaInformation.recinto._id,
                        zona: {
                            _id: $scope.juntaInformation.recinto.zona._id,
                            parroquia: {
                                _id: $scope.juntaInformation.recinto.zona.parroquia._id,
                                canton: {
                                    _id: $scope.juntaInformation.recinto.zona.parroquia.canton._id,
                                    provincia: {
                                        _id: $scope.juntaInformation.recinto.zona.parroquia.canton.provincia._id,
                                        region: $scope.juntaInformation.recinto.zona.parroquia.canton.provincia.region
                                    }
                                }
                            }
                        }
                    }
                };
                registro.JUNTA = juntaObject;

                serviceVoto.SaveVoto.save(registro, function (response) {
                    $('#saveVotos').modal('hide');
                    $scope.notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 2000);
                    getListas();
                    juntasOfUserAsignado();
                    $scope.selectedJunta = null;
                    clearData();
                }, function (errorResponse) {
                    if (angular.isDefined(errorResponse.data.message)) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                    } else {
                        $scope.notification.showErrorWithFilter(errorResponse.data, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                    }
                });

            };

            ctrl.sum = sum;
            ctrl.saveModalVoto = saveModalVoto;

        }
    ]);
}(window.angular));