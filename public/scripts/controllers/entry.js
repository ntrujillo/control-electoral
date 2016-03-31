(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').controller('EntryCtrl', ['$scope', '$http', '$state', '$uibModal', 'FactoryGenero', 'Canton', 'Province', 'Parroquia', 'Zona', 'Recinto', 'Junta',
        function ($scope, $http, $state, $modal, generos, cantones, provinces, parroquias, zonas, recintos, juntas) {

            var ctrl = this;


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


            //return provinces
            provinces.query(function (provinces) {
                $scope.provincesList = angular.fromJson(provinces);
            }, function (err) {
                console.err(err);
            });

            //return cantones by Province
            $scope.getCantones = function (provinceCode) {
                cantones.query({codeProvince: provinceCode}, function (cantones) {
                    $scope.cantonesByProvinceList = angular.fromJson(cantones);
                }, function (err) {
                    console.err(err);
                });
            };

            //return parroquias by Cantones
            $scope.getParroquias = function (cantonCode) {
                if (cantonCode !== null) {
                    parroquias.query({codeCanton: cantonCode}, function (parroquias, status) {
                        $scope.parroquiasByCantonList = angular.fromJson(parroquias);
                    }, function (err, status) {
                        console.err(err);
                    });
                } else {
                    $scope.parroquiasByCantonList = [];
                }

            };

            //return zonas by Parroquias
            $scope.getZonas = function (parroquiaCode) {
                $scope.zonasByParroquiaList = [];
                if (parroquiaCode !== null) {
                    zonas.query({codeParroquia: parroquiaCode}, function (zonas) {
                        $scope.zonasByParroquiaList = angular.fromJson(zonas);
                    }, function (err) {
                        console.err(err);
                    });
                } else {
                    $scope.zonasByParroquiaList = [];
                }

            };

            //return recintos by Zone
            $scope.getRecintos = function (zonaCode) {
                $scope.recintosByZona = [];
                var parroquiaCode = $scope.selectedParroquia;
                if (zonaCode !== null) {
                    recintos.query({codeZona: zonaCode, codeParroquia: parroquiaCode}, function (recintos) {
                        $scope.recintosByZona = angular.fromJson(recintos);
                    }, function (err) {
                        console.err(err);
                    });
                } else {
                    $scope.recintosByZona = [];
                }

            };

            $scope.getGeneros = function (flag) {
                if (flag) {
                    $scope.generoList = generos.getGenero();
                } else {
                    $scope.generoList = [];
                }

            };

            //return juntas by recinto and genero
            $scope.getJuntas = function (codeRecinto, genero) {
                $scope.juntasList = [];
                if (genero !== null) {
                    juntas.juntaByRecinto.query({codeRecinto: codeRecinto, genero: genero}, function (juntas) {
                        $scope.juntasList = angular.fromJson(juntas);
                    }, function (err) {
                        console.err(err);
                    });
                } else {
                    $scope.juntasList = [];
                }
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
                            }
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
                            )
                        }]
                    }
                });

                modalInstance.result.then(function (obj) {
                    ctrl.result = obj;

                });
            };


            ctrl.showModal = showModal;

        }
    ]);

}(window.angular));