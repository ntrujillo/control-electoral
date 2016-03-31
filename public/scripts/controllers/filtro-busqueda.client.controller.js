(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').controller('FiltroCtrl', ['$scope', '$http', '$state', '$uibModal', 'Filtros', 'Voto', 'Lista',
        function ($scope, $http, $state, $modal, filtros, votos, lista) {
            var listas = [];
            var series = [];

            $scope.selectedProvincia = null;
            $scope.selectedCanton = null;
            $scope.selectedParroquia = null;

            $scope.provincesList = [];
            $scope.cantonesByProvinceList = [];
            $scope.parroquiasByCantonList = [];

            $scope.titleGrafico = "Resultados Generales";

            //return provinces
            filtros.Provincias.query(function (provinces) {
                $scope.provincesList = angular.fromJson(provinces);
            }, function (err) {
                console.err(err);
            });

            //return cantones by Province
            $scope.getCantones = function (provinceCode) {
                filtros.Canton.query({codeProvince: provinceCode}, function (cantones) {
                    $scope.cantonesByProvinceList = angular.fromJson(cantones);
                }, function (err) {
                    console.err(err);
                });
            };

            //return parroquias by Cantones
            $scope.getParroquias = function (cantonCode) {
                if (cantonCode !== null) {
                    filtros.Parroquia.query({codeCanton: cantonCode}, function (parroquias, status) {
                        $scope.parroquiasByCantonList = angular.fromJson(parroquias);
                    }, function (err, status) {
                        console.err(err);
                    });
                } else {
                    $scope.parroquiasByCantonList = [];
                }

            };


            function votosTotalLista(idLista, nameLista) {
                var vots = 0;
                votos.totalVotosLista.get({codeLista: idLista}, function (response) {
                    vots = response.totalVotos;
                    var serie = {
                        text: nameLista,
                        values: [vots]
                    }
                    series.push(serie);
                });
            }

            function votosTotalListaByProvincia(idLista, nameList, idProvincia) {
                var vots = 0;
                votos.totalVotosListaProvincia.get({
                    codeProvince: idProvincia,
                    codeLista: idLista
                }, function (response) {
                    vots = response.totalVotos;
                    var serie = {
                        text: nameList,
                        values: [vots]
                    }
                    series.push(serie);
                });
            }

            function votosTotalListaByCanton(idLista, nameList, idCanton) {
                var vots = 0;
                votos.totalVotosListaCanton.get({
                    codeCanton: idCanton,
                    codeLista: idLista
                }, function (response) {
                    vots = response.totalVotos;
                    var serie = {
                        text: nameList,
                        values: [vots]
                    }
                    series.push(serie);
                });
            }

            function votosTotalListaByParroquia(idLista, nameList, idParroquia) {
                var vots = 0;
                votos.totalVotosListaParroquia.get({
                    codeParroquia: idParroquia,
                    codeLista: idLista
                }, function (response) {
                    vots = response.totalVotos;
                    var serie = {
                        text: nameList,
                        values: [vots]
                    }
                    series.push(serie);
                });
            }

            $scope.initData = function () {
                //votos Blancos
                // series = [];
                var votosBlancoTotal = votos.votosBlancoTotal.get(function (votos) {
                    votosBlancoTotal = votos.votosBlancos;
                    var votBlanco = {
                        text: "Blancos",
                        values: [votosBlancoTotal]
                    }
                    series.push(votBlanco);

                });

                //votosNulos
                var votosNulosTotal = votos.votosNulosTotal.get(function (votos) {
                    votosNulosTotal = votos.votosNulos;
                    var votNulos = {
                        text: "Nulos",
                        values: [votosNulosTotal]
                    }
                    series.push(votNulos);

                });
                lista.query(function (lista) {
                    listas = angular.fromJson(lista);
                    listas.forEach(function (item) {
                        votosTotalLista(item._id, item.NOM_LISTA);
                    });

                });


            };


            //votos por filtros
            //por Provincia
            $scope.SearchByProvoncia = function () {
                series = [];
                if ($scope.selectedProvincia !== null) {

                    votos.votosBlancoByProvince.get({codeProvince: $scope.selectedProvincia}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        var votBlanco = {
                            text: "Blancos",
                            values: [votosBlanco]
                        }
                        series.push(votBlanco);
                    });

                    votos.votosNulosByProvince.get({codeProvince: $scope.selectedProvincia}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        var votNulos = {
                            text: "Nulos",
                            values: [votosNulosTotal]
                        }
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByProvincia(item._id, item.NOM_LISTA, $scope.selectedProvincia);
                    });
                    $scope.myJson.series = series;

                } else {
                    alert('Seleccione Provincia');
                }

            };

            //porCanton
            $scope.SearchByCanton = function () {
                series = [];
                if ($scope.selectedCanton !== null) {

                    votos.votosBlancoByCanton.get({codeCanton: $scope.selectedCanton}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        var votBlanco = {
                            text: "Blancos",
                            values: [votosBlanco]
                        }
                        series.push(votBlanco);
                    });

                    votos.votosNulosByCanton.get({codeCanton: $scope.selectedCanton}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        var votNulos = {
                            text: "Nulos",
                            values: [votosNulosTotal]
                        }
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByCanton(item._id, item.NOM_LISTA, $scope.selectedCanton);
                    });
                    $scope.myJson.series = series;

                } else {
                    alert('Seleccione Canton');
                }

            };

            //por Parroquia
            $scope.SearchByParroquia = function () {
                series = [];
                if ($scope.selectedParroquia !== null) {

                    votos.votosBlancoByParroquia.get({codeParroquia: $scope.selectedParroquia}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        var votBlanco = {
                            text: "Blancos",
                            values: [votosBlanco]
                        }
                        series.push(votBlanco);
                    });

                    votos.votosNulosByParroquia.get({codeParroquia: $scope.selectedParroquia}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        var votNulos = {
                            text: "Nulos",
                            values: [votosNulosTotal]
                        }
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByParroquia(item._id, item.NOM_LISTA, $scope.selectedParroquia);
                    });
                    $scope.myJson.series = series;

                } else {
                    alert('Seleccione Parroquia');
                }

            };

            $scope.myJson = {
                globals: {
                    shadow: false,
                    fontFamily: "Verdana",
                    fontWeight: "100"
                },
                type: "pie3d",
                backgroundColor: "#fff",

                legend: {
                    layout: "x5",
                    position: "60%",
                    borderColor: "transparent",
                    marker: {
                        borderRadius: 10,
                        borderColor: "transparent"
                    }
                },
                tooltip: {
                    //text: "%v votos",
                    "visible": true, //Specify your visibility: true or false.
                    text: "%t <br>%npv%<br>%v votos"  //Specify your tooltip text.
                },
                plot: {
                    refAngle: "-90",
                    borderWidth: "0px",
                    valueBox: {
                        placement: "in",
                        text: "%npv %",
                        fontSize: "13px",
                        textAlpha: 1
                    }
                },
                series: series
            };


        }
    ]);

}(window.angular));