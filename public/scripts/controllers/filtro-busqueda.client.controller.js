(function (angular) {
    angular.module('ControlElectoralApp').controller('FiltroCtrl', ['$scope', '$http', '$state', '$uibModal', 'Filtros', 'Voto', 'Lista', 'APP',
        function ($scope, $http, $state, $modal, filtros, votos, lista, constant) {
            var listas = [], series = [],
                series2 = [], objectColumn, serieColumn = [];

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

            $scope.resumenVotos = [];
            $scope.resumenOtros = [];

            $scope.gridOptions = {
                exporterPdfHeader: {text: "", style: 'headerStyle', alignment: 'center'},
                exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
                exporterPdfPageSize: 'LETTER',
                exporterPdfMaxGridWidth: 630,
                enableSorting: true,
                exporterMenuCsv: false,
                enableGridMenu: true,
                exporterPdfFilename: 'Resultados',
                exporterPdfDefaultStyle: {fontSize: 18},
                exporterPdfTableHeaderStyle: {fontSize: 18, bold: true, color: 'red'},
                exporterPdfFooter: function (currentPage, pageCount) {
                    return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
                },
                exporterPdfCustomFormatter: function (docDefinition) {
                    docDefinition.styles.headerStyle = {fontSize: 18, bold: true};
                    docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
                    return docDefinition;
                },
                columnDefs: [
                    {field: 'descripcion', headerCellClass: 'header-ui-grid', name: ' '},
                    {field: 'votos', headerCellClass: 'header-ui-grid', name: 'Votos'}
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                }
            };

            $scope.limpiar = function () {
                $scope.selectedProvincia = null;
                $scope.selectedCanton = null;
                $scope.selectedParroquia = null;
                $scope.selectedZona = null;
                $scope.selectedRecinto = null;
                $scope.selectedJunta = null;
                $scope.gridOptions.data = [];
                $scope.initData();
            };

            //return provinces
            filtros.Provincias.query({sort: "name"}, function (provinces) {
                $scope.provincesList = angular.fromJson(provinces);
            }, function (err) {
                console.err(err);
            });

            //return cantones by Province
            $scope.getCantones = function (provinceCode) {
                if (provinceCode !== null) {
                    filtros.Canton.query({id_provincia: provinceCode, sort: "name"}, function (cantones) {
                        $scope.cantonesByProvinceList = angular.fromJson(cantones);
                    }, function (err) {
                        console.err(err);
                    });
                } else {
                    $scope.cantonesByProvinceList = [];
                }
            };

            //return parroquias by Cantones
            $scope.getParroquias = function (cantonCode) {
                if (cantonCode !== null) {
                    filtros.Parroquia.query({id_canton: cantonCode, sort: "name"}, function (parroquias) {
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
                    filtros.Zona.query({id_parroquia: parroquiaCode, sort: "name"}, function (zonas) {
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
                    filtros.Recinto.query({id_zona: zonaCode, sort: "name"}, function (recintos) {
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

            function existeVoto(data, voto) {
                var flag = false;
                data.forEach(function (item) {
                    if (item.descripcion === voto.descripcion) {
                        flag = true;
                    }
                });
                return flag;
            }

            function votosTotalLista(idLista, nameLista) {
                $scope.resumenVotos = [];
                var vots = 0;
                votos.totalVotosLista.get({codeLista: idLista}, function (response) {
                    vots = response.totalVotos;
                    $scope.resumenVotos.push({descripcion: nameLista, votos: vots});
                    gridOptionsData($scope.resumenVotos);
                    $scope.gridOptions.exporterPdfHeader.text = 'Resultados Generales';

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
                    objectColumn = {
                        name: nameLista,
                        y: ((vots * 100) / $scope.votosTotales),
                        drilldown: nameLista
                    };
                    serieColumn.push(objectColumn);
                    graficoColumnChar(serieColumn, 'Resultados generales');
                    grafico(series2, 'Resultados generales');
                });
            }

            function votosTotalListaByProvincia(idLista, nameList, idProvincia) {
                var vots = 0;
                $scope.resumenVotos = [];
                $scope.gridOptions.data = [];
                votos.totalVotosListaProvincia.get({
                    codeProvince: idProvincia,
                    codeLista: idLista
                }, function (response) {
                    vots = response.totalVotos;
                    $scope.resumenVotos.push({descripcion: nameList, votos: vots});
                    gridOptionsData($scope.resumenVotos);
                    $scope.gridOptions.exporterPdfHeader.text = 'Resultados de la provincia ' + $scope.selectedProvincia.name;
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
                    objectColumn = {
                        name: nameList,
                        y: ((vots * 100) / $scope.votosTotales),
                        drilldown: nameList
                    };
                    serieColumn.push(objectColumn);
                    graficoColumnChar(serieColumn, 'Resultados de la provincia ' + $scope.selectedProvincia.name);
                    series.push(serie);
                    series2.push(serie2);
                    grafico(series2, 'Resultados de la provincia ' + $scope.selectedProvincia.name);
                });
            }

            function votosTotalListaByCanton(idLista, nameList, idCanton) {
                var vots = 0;
                $scope.resumenVotos = [];
                $scope.gridOptions.data = [];
                votos.totalVotosListaCanton.get({
                    codeCanton: idCanton,
                    codeLista: idLista
                }, function (response) {
                    vots = response.totalVotos;
                    $scope.resumenVotos.push({descripcion: nameList, votos: vots});
                    gridOptionsData($scope.resumenVotos);
                    $scope.gridOptions.exporterPdfHeader.text = 'Resultados del cant\u00f3n ' + $scope.selectedCanton.name;
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
                    objectColumn = {
                        name: nameList,
                        y: ((vots * 100) / $scope.votosTotales),
                        drilldown: nameList
                    };
                    serieColumn.push(objectColumn);
                    graficoColumnChar(serieColumn, 'Resultados del cant\u00f3n ' + $scope.selectedCanton.name);
                    series2.push(serie2);
                    series.push(serie);
                    grafico(series2, 'Resultados del cant\u00f3n ' + $scope.selectedCanton.name);
                });
            }

            function votosTotalListaByParroquia(idLista, nameList, idParroquia) {
                var vots = 0;
                $scope.resumenVotos = [];
                $scope.gridOptions.data = [];
                votos.totalVotosListaParroquia.get({
                    codeParroquia: idParroquia,
                    codeLista: idLista
                }, function (response) {
                    vots = response.totalVotos;
                    $scope.resumenVotos.push({descripcion: nameList, votos: vots});
                    gridOptionsData($scope.resumenVotos);
                    $scope.gridOptions.exporterPdfHeader.text = 'Resultados de la parroquia ' + $scope.selectedParroquia.name;
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
                    objectColumn = {
                        name: nameList,
                        y: ((vots * 100) / $scope.votosTotales),
                        drilldown: nameList
                    };
                    serieColumn.push(objectColumn);
                    graficoColumnChar(serieColumn, 'Resultados de la parroquia ' + $scope.selectedParroquia.name);
                    series2.push(serie2);
                    series.push(serie);
                    grafico(series2, 'Resultados de la parroquia ' + $scope.selectedParroquia.name);
                });
            }

            function votosTotalListaByZona(idLista, nameList, idZona) {
                var vots = 0;
                $scope.resumenVotos = [];
                $scope.gridOptions.data = [];
                votos.totalVotosListaFiltro.get({
                    codeZona: idZona,
                    codeLista: idLista
                }, function (response) {
                    vots = response.totalVotos;
                    $scope.resumenVotos.push({descripcion: nameList, votos: vots});
                    gridOptionsData($scope.resumenVotos);
                    $scope.gridOptions.exporterPdfHeader.text = 'Resultados de la zona ' + $scope.selectedZona.name;
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
                    objectColumn = {
                        name: nameList,
                        y: ((vots * 100) / $scope.votosTotales),
                        drilldown: nameList
                    };
                    serieColumn.push(objectColumn);
                    graficoColumnChar(serieColumn, 'Resultados de la zona ' + $scope.selectedZona.name);
                    series2.push(serie2);
                    series.push(serie);
                    grafico(series2, 'Resultados de la zona ' + $scope.selectedZona.name);
                });
            }

            function votosTotalListaByRecinto(idLista, nameList, idRecinto) {
                var vots = 0;
                $scope.resumenVotos = [];
                $scope.gridOptions.data = [];
                votos.totalVotosListaFiltro.get({
                    codeRecinto: idRecinto,
                    codeLista: idLista
                }, function (response) {
                    vots = response.totalVotos;
                    $scope.resumenVotos.push({descripcion: nameList, votos: vots});
                    gridOptionsData($scope.resumenVotos);
                    $scope.gridOptions.exporterPdfHeader.text = 'Resultados del recinto ' + $scope.selectedRecinto.name;
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
                    objectColumn = {
                        name: nameList,
                        y: ((vots * 100) / $scope.votosTotales),
                        drilldown: nameList
                    };
                    serieColumn.push(objectColumn);
                    graficoColumnChar(serieColumn, 'Resultados del recinto ' + $scope.selectedRecinto.name);
                    series2.push(serie2);
                    series.push(serie);
                    grafico(series2, 'Resultados del recinto ' + $scope.selectedRecinto.name);
                });
            }

            function votosTotalListaByJunta(idLista, nameList, idJunta) {
                var vots = 0;
                $scope.resumenVotos = [];
                $scope.gridOptions.data = [];
                votos.totalVotosListaFiltro.get({
                    codeJunta: idJunta,
                    codeLista: idLista
                }, function (response) {
                    vots = response.totalVotos;
                    $scope.resumenVotos.push({descripcion: nameList, votos: vots});
                    gridOptionsData($scope.resumenVotos);
                    $scope.gridOptions.exporterPdfHeader.text = 'Resultados de la junta ' + $scope.selectedJunta.junta + ' ' + $scope.selectedJunta.gender + ' del recinto ' + $scope.selectedRecinto.name;
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
                    objectColumn = {
                        name: nameList,
                        y: ((vots * 100) / $scope.votosTotales),
                        drilldown: nameList
                    };
                    serieColumn.push(objectColumn);
                    graficoColumnChar(serieColumn, 'Resultados de la junta ' + $scope.selectedJunta.junta + ' ' + $scope.selectedJunta.gender);
                    series2.push(serie2);
                    series.push(serie);
                    grafico(series2, 'Resultados de la junta ' + $scope.selectedJunta.junta + ' ' + $scope.selectedJunta.gender);
                });
            }

            function gridOptionsData(data) {
                data.forEach(function (resumen) {
                    if (!existeVoto($scope.gridOptions.data, resumen)) {
                        $scope.gridOptions.data.push(resumen);
                    }
                });
            }

            $scope.initData = function () {
                getVotosTotales();
                $scope.resumenOtros = [];
                series2 = [];
                serieColumn = [];
                //votos Blancos
                var votosBlancoTotal = votos.votosBlancoTotal.get(function (votos) {
                    votosBlancoTotal = votos.votosBlancos;
                    $scope.resumenOtros.push({descripcion: "Blancos", votos: votosBlancoTotal});
                    gridOptionsData($scope.resumenOtros);

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
                    objectColumn = {
                        name: 'Blancos',
                        y: ((votosBlancoTotal * 100) / $scope.votosTotales),
                        drilldown: 'Blancos'
                    };
                    serieColumn.push(objectColumn);
                    series2.push(serie2);
                    series.push(votBlanco);
                });

                //votosNulos
                var votosNulosTotal = votos.votosNulosTotal.get(function (votos) {
                    votosNulosTotal = votos.votosNulos;
                    $scope.resumenOtros.push({descripcion: "Nulos", votos: votosNulosTotal});
                    gridOptionsData($scope.resumenOtros);

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
                    objectColumn = {
                        name: 'Nulos',
                        y: ((votosNulosTotal * 100) / $scope.votosTotales),
                        drilldown: 'Nulos'
                    };
                    serieColumn.push(objectColumn);
                    series2.push(serie2);
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
                $scope.resumenOtros = [];
                series2 = [];
                serieColumn = [];
                if ($scope.selectedProvincia !== null) {
                    votos.votosBlancoByProvince.get({codeProvince: $scope.selectedProvincia._id}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        $scope.resumenOtros.push({descripcion: "Blancos", votos: votosBlanco});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Blancos',
                            y: ((votosBlanco * 100) / $scope.votosTotales),
                            drilldown: 'Blancos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votBlanco);
                    });

                    votos.votosNulosByProvince.get({codeProvince: $scope.selectedProvincia._id}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        $scope.resumenOtros.push({descripcion: "Nulos", votos: votosNulosTotal});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Nulos',
                            y: ((votosNulosTotal * 100) / $scope.votosTotales),
                            drilldown: 'Nulos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByProvincia(item._id, item.NOM_LISTA, $scope.selectedProvincia._id);
                    });
                    $scope.myJson.series = series;

                }
            };

            //porCanton
            $scope.SearchByCanton = function () {
                series = [];
                series2 = [];
                serieColumn = [];
                $scope.resumenOtros = [];
                if ($scope.selectedCanton !== null) {
                    votos.votosBlancoByCanton.get({codeCanton: $scope.selectedCanton._id}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        $scope.resumenOtros.push({descripcion: "Blancos", votos: votosBlanco});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Blancos',
                            y: ((votosBlanco * 100) / $scope.votosTotales),
                            drilldown: 'Blancos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votBlanco);
                    });

                    votos.votosNulosByCanton.get({codeCanton: $scope.selectedCanton._id}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        $scope.resumenOtros.push({descripcion: "Nulos", votos: votosNulosTotal});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Nulos',
                            y: ((votosNulosTotal * 100) / $scope.votosTotales),
                            drilldown: 'Nulos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByCanton(item._id, item.NOM_LISTA, $scope.selectedCanton._id);
                    });
                    $scope.myJson.series = series;

                }
            };

            //por Parroquia
            $scope.SearchByParroquia = function () {
                series = [];
                series2 = [];
                serieColumn = [];
                $scope.resumenOtros = [];
                if ($scope.selectedParroquia !== null) {
                    votos.votosBlancoByParroquia.get({codeParroquia: $scope.selectedParroquia._id}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        $scope.resumenOtros.push({descripcion: "Blancos", votos: votosBlanco});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Blancos',
                            y: ((votosBlanco * 100) / $scope.votosTotales),
                            drilldown: 'Blancos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votBlanco);
                    });

                    votos.votosNulosByParroquia.get({codeParroquia: $scope.selectedParroquia._id}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        $scope.resumenOtros.push({descripcion: "Nulos", votos: votosNulosTotal});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Nulos',
                            y: ((votosNulosTotal * 100) / $scope.votosTotales),
                            drilldown: 'Nulos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByParroquia(item._id, item.NOM_LISTA, $scope.selectedParroquia._id);
                    });
                    $scope.myJson.series = series;

                }
            };

            //por Zona
            $scope.SearchByZona = function () {
                series = [];
                series2 = [];
                serieColumn = [];
                $scope.resumenOtros = [];
                if ($scope.selectedZona !== null) {
                    votos.votosBlancoFiltro.get({codeZona: $scope.selectedZona._id}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        $scope.resumenOtros.push({descripcion: "Blancos", votos: votosBlanco});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Blancos',
                            y: ((votosBlanco * 100) / $scope.votosTotales),
                            drilldown: 'Blancos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votBlanco);
                    });

                    votos.votosNulosFiltro.get({codeZona: $scope.selectedZona._id}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        $scope.resumenOtros.push({descripcion: "Nulos", votos: votosNulosTotal});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Nulos',
                            y: ((votosNulosTotal * 100) / $scope.votosTotales),
                            drilldown: 'Nulos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByZona(item._id, item.NOM_LISTA, $scope.selectedZona._id);
                    });
                    $scope.myJson.series = series;

                }
            };

            //por Recinto
            $scope.SearchByRecinto = function () {
                series = [];
                series2 = [];
                serieColumn = [];
                $scope.resumenOtros = [];
                if ($scope.selectedRecinto !== null) {
                    votos.votosBlancoFiltro.get({codeRecinto: $scope.selectedRecinto._id}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        $scope.resumenOtros.push({descripcion: "Blancos", votos: votosBlanco});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Blancos',
                            y: ((votosBlanco * 100) / $scope.votosTotales),
                            drilldown: 'Blancos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votBlanco);
                    });

                    votos.votosNulosFiltro.get({codeRecinto: $scope.selectedRecinto._id}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        $scope.resumenOtros.push({descripcion: "Nulos", votos: votosNulosTotal});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Nulos',
                            y: ((votosNulosTotal * 100) / $scope.votosTotales),
                            drilldown: 'Nulos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByRecinto(item._id, item.NOM_LISTA, $scope.selectedRecinto._id);
                    });
                    $scope.myJson.series = series;

                }
            };

            //por Junta
            $scope.SearchByJunta = function () {
                series = [];
                series2 = [];
                serieColumn = [];
                $scope.resumenOtros = [];
                if ($scope.selectedJunta !== null) {
                    votos.votosBlancoFiltro.get({codeJunta: $scope.selectedJunta._id}, function (votos) {
                        var votosBlanco = votos.votosBlancos;
                        $scope.resumenOtros.push({descripcion: "Blancos", votos: votosBlanco});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Blancos',
                            y: ((votosBlanco * 100) / $scope.votosTotales),
                            drilldown: 'Blancos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votBlanco);
                    });

                    votos.votosNulosFiltro.get({codeJunta: $scope.selectedJunta._id}, function (votos) {
                        var votosNulosTotal = votos.votosNulos;
                        $scope.resumenOtros.push({descripcion: "Nulos", votos: votosNulosTotal});
                        gridOptionsData($scope.resumenOtros);
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
                        objectColumn = {
                            name: 'Nulos',
                            y: ((votosNulosTotal * 100) / $scope.votosTotales),
                            drilldown: 'Nulos'
                        };
                        serieColumn.push(objectColumn);
                        series2.push(serie2);
                        series.push(votNulos);
                    });

                    listas.forEach(function (item) {
                        votosTotalListaByJunta(item._id, item.NOM_LISTA, $scope.selectedJunta._id);
                    });
                    $scope.myJson.series = series;

                }
            };

            $scope.countTotalVotos = function () {
                var votosTotales = 0;
                $scope.resumenVotos.forEach(function (voto) {
                    votosTotales += voto.votos;
                });
                $scope.resumenOtros.forEach(function (voto) {
                    votosTotales += voto.votos;
                });
                return votosTotales;
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
            function getVotosTotales() {
                votos.votosTotales.get(function (response) {
                    $scope.votosTotales = response.votosTotales;
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            function grafico(series2, title) {
                $('#container').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                        //options3d: {
                        //    enabled: true,
                        //    alpha: 45,
                        //    beta: 0
                        //}
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

            function graficoColumnChar(series, title) {
                $('#containerColumn').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: title
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: 'Porcentaje total'
                        }
                        //max: 100
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: '{point.y:.1f}%'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}%</b><br/>'
                    },
                    series: [{
                        name: 'Porcentaje',
                        colorByPoint: true,
                        data: series
                    }]
                });
            }
        }
    ]);

}(window.angular));