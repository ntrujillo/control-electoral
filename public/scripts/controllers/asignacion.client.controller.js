(function (angular) {
    angular.module('ControlElectoralApp').controller('AsignacionCtrl', ['$scope', '$uibModal', 'FactoryGenero', 'ProvinciaCantonResource', 'ProvinciaResource', 'CantonParroquiaResource', 'ParroquiaZonaResource', 'ZonaRecintoResource',
        'RecintoJuntaResource', 'Users', 'APP', 'JuntaUserResource',
        function ($scope, $modal, generos, ProvinciaCantonResource, ProvinciaResource, CantonParroquiaResource, ParroquiaZonaResource, recintos, RecintoJuntaResource, UserSrv, constant, JuntaUserResource) {

            var ctrl = this;

            $scope.selectedUser = null;
            $scope.selectedProvincia = null;
            $scope.selectedCanton = null;
            $scope.selectedParroquia = null;
            $scope.selectedZona = null;
            $scope.selectedRecinto = null;
            $scope.selectedGenero = null;
            $scope.selectedJunta = null;

            $scope.provincesList = [];
            $scope.cantonesByProvinceList = [];
            $scope.parroquiasByCantonList = [];
            $scope.zonasByParroquiaList = [];
            $scope.recintosByZona = [];
            $scope.generoList = [];
            $scope.juntasList = [];


            //return users
            UserSrv.query({status: 'V'}, function (response) {
                $scope.usersAll = angular.fromJson(response);
            }, function (errorResponse) {
                $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
            });

            //return provinces
            ProvinciaResource.query(function (provinces) {
                $scope.provincesList = angular.fromJson(provinces);
            }, function (errorResponse) {
                $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
            });

            //return cantones by Province
            $scope.getCantones = function (provinceCode) {
                ProvinciaCantonResource.query({id_provincia: provinceCode}, function (cantones) {
                    $scope.cantonesByProvinceList = angular.fromJson(cantones);
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            };

            //return parroquias by Cantones
            $scope.getParroquias = function (cantonCode) {
                if (cantonCode !== null) {
                    CantonParroquiaResource.query({id_canton: cantonCode}, function (parroquias) {
                        $scope.parroquiasByCantonList = angular.fromJson(parroquias);
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                } else {
                    $scope.parroquiasByCantonList = [];
                }

            };

            //return zonas by Parroquias
            $scope.getZonas = function (parroquiaCode) {
                $scope.zonasByParroquiaList = [];
                if (parroquiaCode !== null) {
                    ParroquiaZonaResource.query({id_parroquia: parroquiaCode}, function (zonas) {
                        $scope.zonasByParroquiaList = angular.fromJson(zonas);
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                } else {
                    $scope.zonasByParroquiaList = [];
                }

            };

            //return recintos by Zone
            $scope.getRecintos = function (zonaCode) {
                $scope.recintosByZona = [];
                if (zonaCode !== null) {
                    recintos.query({id_zona: zonaCode}, function (recintos) {
                        $scope.generoList = [];
                        $scope.recintosByZona = angular.fromJson(recintos);
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                } else {
                    $scope.recintosByZona = [];
                }

            };

            $scope.getGeneros = function (flag) {
                $scope.generoList = [];
                $scope.selectedGenero = null;
                if (flag != null) {
                    $scope.selectedJunta = null;
                    $scope.generoList = generos.getGenero();
                } else {
                    $scope.generoList = [];
                }
            };

            //return juntas by recinto and genero
            $scope.getJuntas = function (codeRecinto, genero) {
                $scope.juntasList = [];
                if (genero !== null) {
                    RecintoJuntaResource.query({
                        id_recinto: codeRecinto,
                        status: 'NA',
                        gender: genero
                    }, function (juntas) {
                        $scope.juntasList = angular.fromJson(juntas);
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                } else {
                    $scope.juntasList = [];
                }
            };

            $scope.create = function () {
                var junta = {
                    junta: $scope.selectedJunta,
                    status: 'A'
                };
                JuntaUserResource.save({id_user: $scope.selectedUser}, junta, function (response) {
                    $scope.notification.success(response.message, 'CONTAINER.MESSAGES.MESSAGE_SUCCESS', 2000);
                    $scope.getJuntas($scope.selectedRecinto, $scope.selectedGenero);
                }, function (errorResponse) {
                    if (angular.isDefined(errorResponse.data.message)) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                    } else {
                        $scope.notification.showErrorWithFilter(errorResponse.data, 'CONTAINER.MESSAGES.MESSAGE_ERROR');
                    }
                });
            };

            function showModal() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/entry-modal.html',
                    controller: 'EntryDialogCtrl as ctrl',
                    backdrop: 'static',
                    animation: true,
                    resolve: {
                        entity: function () {
                            return {
                                provincia: $scope.selectedProvincia,
                                canton: $scope.selectedCanton,
                                parroquia: $scope.selectedParroquia,
                                zona: $scope.selectedZona,
                                recinto: $scope.selectedRecinto,
                                junta: $scope.selectedJunta,
                                genero: $scope.selectedGenero
                            };
                        },
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                    name: 'angular-factory',
                                    files: [
                                        'scripts/services/lista.client.service.js',
                                        'scripts/services/votos.client.service.js',
                                        'scripts/services/registro-service.js',
                                        'scripts/controllers/entry-modal-ctrl.js'
                                    ]
                                }
                            );
                        }]
                    }
                });

                modalInstance.result.then(function (obj) {
                    ctrl.result = obj;
                });
            }

            ctrl.showModal = showModal;

        }
    ]);
}(window.angular));