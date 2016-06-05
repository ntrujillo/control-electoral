(function (angular) {
    angular.module('ControlElectoralApp').controller('FiltroCtrl', ['$scope', '$http', '$state', '$uibModal', 'Filtros', 'Voto', 'Lista', 'APP',
        function ($scope, $http, $state, $modal, filtros, votos, lista, constant) {
            var listas = [];
            var series = [];
            var series2 = [];

            $scope.selectedProvincia = null;
            $scope.selectedCanton = null;
            $scope.selectedParroquia = null;
            $scope.selectedZona = null;
            $scope.selectedRecinto = null;
            $scope.selectedJunta = null;

            $scope.provincesList = [];
            $scope.cantonesByProvinceList = [];
            $scope.parroquiasByCantonList = [];
            $scope.zonasByParroquiaList = [];
            $scope.recintosByZona = [];
            $scope.juntasList = [];

            //return provinces
            filtros.Provincias.query(function (provinces) {
                $scope.provincesList = angular.fromJson(provinces);
            }, function (err) {
                console.err(err);
            });

            //return cantones by Province
            $scope.getCantones = function (provinceCode) {
                filtros.Canton.query({id_provincia: provinceCode}, function (cantones) {
                    $scope.cantonesByProvinceList = angular.fromJson(cantones);
                }, function (err) {
                    console.err(err);
                });
            };

            //return parroquias by Cantones
            $scope.getParroquias = function (cantonCode) {
                if (cantonCode !== null) {
                    filtros.Parroquia.query({id_canton: cantonCode}, function (parroquias) {
                        $scope.parroquiasByCantonList = angular.fromJson(parroquias);
                    }, function (err) {
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
                    filtros.Zona.query({id_parroquia: parroquiaCode}, function (zonas) {
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
                    filtros.Recinto.query({id_zona: zonaCode}, function (recintos) {
                        $scope.recintosByZona = angular.fromJson(recintos);
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                } else {
                    $scope.recintosByZona = [];
                }

            };

            //return juntas by recinto
            $scope.getJuntas = function (codeRecinto) {
                $scope.juntasList = [];
                if (codeRecinto != null) {
                    filtros.Junta.query({
                        id_recinto: codeRecinto
                    }, function (juntas) {
                        $scope.juntasList = angular.fromJson(juntas);
                    }, function (errorResponse) {
                        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                    });
                } else {
                    $scope.juntasList = [];
                }

            };

            function votosTotalLista(idLista, nameLista) {
                var vots = 0;
                votos.totalVotosLista.get({codeLista: idLista}, function (response) {
                    vots = response.totalVotos;
                    var serie = {
                        text: nameLista,
                        values: [vots]
                    };
                    series.push(serie);
                    series2.push({
                        y: vots,
                        name: nameLista,
                        sliced: true,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name} {point.percentage:.1f}%'
                        }
                    });
                    grafico(series2, 'Resultados generales');
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
                    };
                    var serie2 = {
                        y: vots,
                        name: nameList,
                        sliced: true,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name} {point.percentage:.1f}%'
                        }
                    };
                    series.push(serie);
                    series2.push(serie2);
                    grafico(series2, 'Resultados generales');
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
                    };
                    var serie2 = {
                        y: vots,
                        name: nameList,
                        sliced: true,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name} {point.percentage:.1f}%'
                        }
                    };
                    series2.push(serie2);
                    series.push(serie);
                    grafico(series2, 'Resultados generales');
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
                    };
                    var serie2 = {
                        name: nameList,
                        y: vots,
                        sliced: true,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name} {point.percentage:.1f}%'
                        }
                    };
                    series2.push(serie2);
                    series.push(serie);
                    grafico(series2, 'Resultados generales');
                });
            }

            $scope.initData = function () {
                //votos Blancos
                var votosBlancoTotal = votos.votosBlancoTotal.get(function (votos) {
                    votosBlancoTotal = votos.votosBlancos;
                    var votBlanco = {
                        text: "Blancos",
                        values: [votosBlancoTotal]
                    };
                    var serie2 = {
                        name: "Blancos",
                        y: votosBlancoTotal,
                        sliced: true,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name} {point.percentage:.1f}%'
                        }
                    };
                    series2.push(serie2);
                    series.push(votBlanco);

                });

                //votosNulos
                var votosNulosTotal = votos.votosNulosTotal.get(function (votos) {
                    votosNulosTotal = votos.votosNulos;
                    var votNulos = {
                        text: "Nulos",
                        values: [votosNulosTotal]
                    };
                    var serie2 = {
                        name: "Nulos",
                        y: votosNulosTotal,
                        sliced: true,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name} {point.percentage:.1f}%'
                        }
                    };
                    $scope.nl = votosNulosTotal;
                    series2.push(serie2);
                    series.push(votNulos);

                });
                lista.query(function (lista) {
                    listas = angular.fromJson(lista);
                    listas.forEach(function (item) {
                        votosTotalLista(item._id, item.NOM_LISTA);
                    });
                    grafico(series2, 'Resultados generales');
                });
            };

            //votos por filtros
            //por Provincia
            $scope.SearchByProvoncia = function () {
                series = [];
                series2 = [];
                if ($scope.selectedProvincia !== null) {

                    votos.votosBlancoByProvince.get({codeProvince: $scope.selectedProvincia}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        var votBlanco = {
                            text: "Blancos",
                            values: [votosBlanco]
                        };
                        var serie2 = {
                            name: "Blancos",
                            y: votosBlanco,
                            sliced: true,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name} {point.percentage:.1f}%'
                            }
                        };
                        series2.push(serie2);
                        series.push(votBlanco);
                    });

                    votos.votosNulosByProvince.get({codeProvince: $scope.selectedProvincia}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        var votNulos = {
                            text: "Nulos",
                            values: [votosNulosTotal]
                        };
                        var serie2 = {
                            name: "Nulos",
                            y: votosNulosTotal,
                            sliced: true,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name} {point.percentage:.1f}%'
                            }
                        };
                        series2.push(serie2);
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByProvincia(item._id, item.NOM_LISTA, $scope.selectedProvincia);
                    });
                    $scope.myJson.series = series;
                    grafico(series2);

                } else {
                    alert('Seleccione Provincia');
                }

            };

            //porCanton
            $scope.SearchByCanton = function () {
                series = [];
                series2 = [];
                if ($scope.selectedCanton !== null) {

                    votos.votosBlancoByCanton.get({codeCanton: $scope.selectedCanton}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        var votBlanco = {
                            text: "Blancos",
                            values: [votosBlanco]
                        };
                        var serie2 = {
                            name: "Blancos",
                            y: votosBlanco,
                            sliced: true,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name} {point.percentage:.1f}%'
                            }
                        };
                        series2.push(serie2);
                        series.push(votBlanco);
                    });

                    votos.votosNulosByCanton.get({codeCanton: $scope.selectedCanton}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        var votNulos = {
                            text: "Nulos",
                            values: [votosNulosTotal]
                        };
                        var serie2 = {
                            name: "Nulos",
                            y: votosNulosTotal,
                            sliced: true,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name} {point.percentage:.1f}%'
                            }
                        };
                        series2.push(serie2);
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByCanton(item._id, item.NOM_LISTA, $scope.selectedCanton);
                    });
                    $scope.myJson.series = series;
                    grafico(series2);

                } else {
                    alert('Seleccione Canton');
                }

            };

            //por Parroquia
            $scope.SearchByParroquia = function () {
                series = [];
                series2 = [];
                if ($scope.selectedParroquia !== null) {

                    votos.votosBlancoByParroquia.get({codeParroquia: $scope.selectedParroquia}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        var votBlanco = {
                            text: "Blancos",
                            values: [votosBlanco]
                        };
                        var serie2 = {
                            name: "Blancos",
                            y: votosBlanco,
                            sliced: true,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name} {point.percentage:.1f}%'
                            }
                        };
                        series2.push(serie2);
                        series.push(votBlanco);
                    });

                    votos.votosNulosByParroquia.get({codeParroquia: $scope.selectedParroquia}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        var votNulos = {
                            text: "Nulos",
                            values: [votosNulosTotal]
                        };
                        var serie2 = {
                            name: "Nulos",
                            y: votosNulosTotal,
                            sliced: true,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name} {point.percentage:.1f}%'
                            }
                        };
                        series2.push(serie2);
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByParroquia(item._id, item.NOM_LISTA, $scope.selectedParroquia);
                    });
                    $scope.myJson.series = series;
                    grafico(series2);

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
                    "visible": true,
                    text: "%t <br>%npv%<br>%v votos"
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

            function grafico(series2, title) {
                $('#container').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: title
                    },
                    tooltip: {
                        pointFormat: '<b>{point.percentage:.1f}%</b><br><b>{point.y} votos</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        name: 'Porcentaje',
                        colorByPoint: true,
                        data: series2
                    }]
                });
            }
        }
    ]);

}(window.angular));