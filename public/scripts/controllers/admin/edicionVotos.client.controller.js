(function (angular) {
    angular.module('ControlElectoralApp').controller('EdicionVotoCtrl', ['$scope', '$uibModal', 'APP', 'JuntaUserResource', 'Lista', 'Voto', 'Junta', 'RecintoResource', 'AuditoriaService',
        function ($scope, $modal, constant, JuntaUserResource, Lista, serviceVoto, serviceJunta, serviceRecinto, auditoriaService) {
            var ctrl = this, STATUS_VOTO = 'VR', registro = {}, juntaObject = {}, registroAuditoria = {};
            $scope.selectedJunta = null;
            $scope.codigoRecinto = null;
            $scope.votosBlancos = 0;
            $scope.votosNulos = 0;
            $scope.totalVotos = 0;
            $scope.votosValidos = 0;

            $scope.searchJuntas = function () {
                clearData();
                juntasByRecintoWithStatus();
            };

            function juntasByRecintoWithStatus() {
                serviceRecinto.query({
                    q: $scope.codigoRecinto,
                    sort: 'name'
                }, function (result) {
                    //siempre va a retornar un list
                    if (angular.isDefined(result[0])) {
                        ctrl.idRecinto = result[0]._id;
                        serviceJunta.juntaByRecintoWithStatus.query({
                            codeRecinto: ctrl.idRecinto,
                            status: STATUS_VOTO
                        }, function (response) {
                            $scope.juntas = angular.fromJson(response);
                        }, function (errorResponse) {
                            $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                        });
                    }

                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

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

            $scope.changeJunta = function (junta) {
                $scope.juntaInformation = junta;
                if ($scope.juntaInformation !== null) {
                    $scope.genero = $scope.juntaInformation.gender === 'F' ? 'Mujeres' : 'Hombres';
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
                if (angular.isDefined($scope.listas)) {
                    $scope.listas.forEach(function (lista, index) {
                        $scope.listas[index].votos = 0;
                    });
                }
            }

            $scope.saveRegistro = function () {
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

                serviceVoto.get({idJunta: $scope.juntaInformation._id}, function (votoActual) {
                    if (angular.isDefined(votoActual) && votoActual !== null) {
                        registroAuditoria = {
                            junta: $scope.juntaInformation._id,
                            votoAnterior: votoActual,
                            votoActual: registro,
                            usuario: window.user._id
                        };
                        serviceVoto.updateVoto.update({idJunta: $scope.juntaInformation._id}, registro, function (response) {
                            if (response.status == 200) {
                                auditoriaService.Save.save(registroAuditoria, function (response) {
                                    $('#saveVotos').modal('hide');
                                    $scope.notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 2000);
                                    getListas();
                                    $scope.selectedJunta = null;
                                    $scope.codigoRecinto = null;
                                    clearData();
                                }, function (errorResponse) {
                                    if (angular.isDefined(errorResponse.data.message)) {
                                        $scope.notification.showErrorWithFilter(errorResponse.data.message, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                                    } else {
                                        $scope.notification.showErrorWithFilter(errorResponse.data, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                                    }
                                });
                            }
                        });
                    }


                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });

            };

            ctrl.sum = sum;
            ctrl.saveModalVoto = saveModalVoto;

        }
    ]);
}(window.angular));