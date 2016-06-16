(function (angular) {
    angular.module('ControlElectoralApp').controller('ResultsCtrl', ['$scope', 'Junta', 'APP', 'Voto', '$filter', '$http', '$timeout', 'Lista',
        function ($scope, juntaService, constant, serviceVoto, $filter, $http, $timeout, listaService) {
            var dataCategorias = [], dataResults = [], votantes = 0, tiempo = 50, z = 1.96, categoriasBarraError = [], seriesBarraChart = [], arrayLimites = [], arrayPromedio = [],
                rango = [], promedios = [];
            window.ranges = [];
            window.averages = [];


            loadGrafico();
            function loadGrafico() {
                fechasDeVotosRegistrados(function (fechas) {
                    limitesDeConfianza(fechas.minVotoFecha, fechas.maxVotoFecha);
                });
                votosByJunta();


            }

            function getListas(callback) {
                listaService.query(function (lista) {
                    $scope.listas = angular.fromJson(lista);
                    callback($scope.listas);
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            function votos(lista, date, dateUltimoVoto) {
                calculoDeRangos(lista, date, function (response) {
                    console.log('respose', response);

                });

            }

            function fechasByRecorrer(fechaPrimerVoto, fechaUltimoVoto) {
                var fechas = [], dateUltimoVoto = new Date(fechaUltimoVoto), date = new Date(fechaPrimerVoto);
                fechas.push(date.toISOString());
                do {
                    date.setMinutes(date.getMinutes() + tiempo);
                    fechas.push(date.toISOString());
                    console.log('fecha', date);
                } while (date <= dateUltimoVoto);
                console.log('fechasArray', fechas);
                return fechas;
            }

            function limitesDeConfianza(fechaPrimerVoto, fechaUltimoVoto) {
                var date, dateAux, mediana = 0, varianza = 0, flag = true, i = 0,
                    desviacionStndr = 0, k = 0, datos, dataInPorcentaje, limiteInferior = 0, limiteSuperior = 0;
                date = new Date(fechaPrimerVoto);
                var dateUltimoVoto = new Date(fechaUltimoVoto);
                dateAux = angular.copy(date);
                fechasByRecorrer(fechaPrimerVoto, fechaUltimoVoto);
                getListas(function (listas) {
                    listas.forEach(function (lista, index) {
                        categoriasBarraError = [];
                        m(lista, date, dateUltimoVoto);
                        //do {
                        //calculoDeRangos(lista, date, function (response) {
                        //
                        //    dateAux.setMinutes(dateAux.getMinutes() + tiempo);
                        //    if (dateAux <= dateUltimoVoto) {
                        //        console.log('');
                        //    } else if (i === 0) {
                        //        dateAux.setMinutes(dateAux.getMinutes() + tiempo);
                        //        i++;
                        //    } else {
                        //        flag = false;
                        //    }
                        //});
                        //console.log('listaNombre', lista.NOM_LISTA);
                        //$scope.waitForRender(function () {
                        //    serviceVoto.votosDetalladoListaWithFecha.query({
                        //        codeLista: lista._id,
                        //        fecha: date.toISOString()
                        //    }, function (response) {
                        //        var hora = date.getTime();
                        //        var horaFormat = $filter('date')(hora, 'mediumTime');
                        //        categoriasBarraError.push(horaFormat);
                        //
                        //        date.setMinutes(date.getMinutes() + tiempo);
                        //        console.log('response', response);
                        //        datos = [];
                        //        response.forEach(function (voto) {
                        //            datos.push(voto.VOT_VALIDOS.NUM_VOTOS);
                        //        });
                        //        dataInPorcentaje = [];
                        //        dataInPorcentaje = porcentajeVotos(response, totalVotosALaFecha(response));
                        //        console.log('lista', lista.NOM_LISTA);
                        //        mediana = calculoMedia(datos);
                        //        varianza = calculoVarianza(datos);
                        //        desviacionStndr = desviacionStandar(varianza);
                        //        k = calculoValorK(desviacionStndr, datos.length);
                        //        limiteInferior = parseFloat((mediana - k).toFixed(2));
                        //        limiteSuperior = parseFloat((mediana + k).toFixed(2));
                        //        //console.log('medaina', parseFloat((mediana).toFixed(2)));
                        //        //console.log('varianza', varianza);
                        //        //console.log('desviacion', desviacionStndr);
                        //        //console.log('k', k);
                        //        console.log('limiteInferior', limiteInferior);
                        //        console.log('limiteSuperoir', limiteSuperior);
                        //        arrayLimites = [lista._id, limiteInferior, limiteSuperior];
                        //        arrayPromedio = [lista._id, mediana];
                        //       // containerBandasError(categoriasBarraError, arrayLimites, arrayPromedio, lista.NOM_LISTA, index);
                        //    }, function (errorResponse) {
                        //        $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                        //    });
                        //    console.log('medianaUltimo', limiteInferior);
                        //});
                        //dateAux.setMinutes(dateAux.getMinutes() + tiempo);
                        //if (dateAux <= dateUltimoVoto) {
                        //    console.log('');
                        //} else if (i === 0) {
                        //    dateAux.setMinutes(dateAux.getMinutes() + tiempo);
                        //    i++;
                        //} else {
                        //    flag = false;
                        //}
                        // } while (flag);
                        //date = new Date(fechaPrimerVoto);
                        //dateAux = new Date(fechaPrimerVoto);
                        //flag = true;
                        //i = 0;
                    });
                });
            }

            function calculoDeRangos(lista, date, callback) {
                var datos = [], dataInPorcentaje = [], mediana = 0, varianza = 0, desviacionStndr = 0, k = 0, limiteInferior = 0, limiteSuperior = 0;
                serviceVoto.votosDetalladoListaWithFecha.query({
                    codeLista: lista._id,
                    fecha: date.toISOString()
                }, function (response) {
                    var hora = date.getTime();
                    var horaFormat = $filter('date')(hora, 'mediumTime');
                    categoriasBarraError.push(horaFormat);

                    date.setMinutes(date.getMinutes() + tiempo);
                    console.log('response', response);
                    datos = [];
                    response.forEach(function (voto) {
                        datos.push(voto.VOT_VALIDOS.NUM_VOTOS);
                    });
                    dataInPorcentaje = [];
                    dataInPorcentaje = porcentajeVotos(response, totalVotosALaFecha(response));
                    console.log('lista', lista.NOM_LISTA);
                    mediana = calculoMedia(datos);
                    varianza = calculoVarianza(datos);
                    desviacionStndr = desviacionStandar(varianza);
                    k = calculoValorK(desviacionStndr, datos.length);
                    limiteInferior = parseFloat((mediana - k).toFixed(2));
                    limiteSuperior = parseFloat((mediana + k).toFixed(2));
                    //console.log('medaina', parseFloat((mediana).toFixed(2)));
                    //console.log('varianza', varianza);
                    //console.log('desviacion', desviacionStndr);
                    //console.log('k', k);
                    console.log('limiteInferior', limiteInferior);
                    console.log('limiteSuperoir', limiteSuperior);
                    arrayLimites = [lista._id, limiteInferior, limiteSuperior];
                    arrayPromedio = [lista._id, mediana];
                    callback(datos);
                    // containerBandasError(categoriasBarraError, arrayLimites, arrayPromedio, lista.NOM_LISTA, index);
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            function totalVotosALaFecha(dataVotos) {
                var totalVotos = 0;
                dataVotos.forEach(function (votos) {
                    totalVotos = totalVotos + votos.TOTAL_VOTOS;
                });
                return totalVotos;
            }

            function porcentajeVotos(dataVotos, votosTotal) {
                var totalVotos = 0, dataInPorcentaje = [];
                dataVotos.forEach(function (votos) {
                    totalVotos = (votos.VOT_VALIDOS.NUM_VOTOS * 100) / votosTotal;
                    dataInPorcentaje.push(totalVotos);
                });
                return dataInPorcentaje;
            }

            function votosByJunta() {
                juntaService.Junta.get(function (response) {
                    votantes = response.totalVotantes;
                    console.log('votantes', votantes);
                    $scope.waitForRender(function () {
                        dataVotos($scope.fechas.minVotoFecha, $scope.fechas.maxVotoFecha, function (results) {
                            //console.log('dataRenderCategorais', results.r);
                            //console.log('dataRenderResults', results.f);
                        });
                    });

                    lineGrafico(votantes, $scope.getValueStorage('horaVoto'));
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            $scope.waitForRender = function (afterRenderFunction) {
                var waitForRender = function () {
                    if ($http.pendingRequests.length > 0) {
                        $timeout(waitForRender);
                    } else {
                        afterRenderFunction();
                    }
                };
                $timeout(waitForRender);
            };

            function dataVotos(fechaPrimerVoto, fechaUltimoVoto, callback) {
                var date, dateUltimoVoto, dateFormat, votos = 0, flag = true, i = 0, dateAux;
                date = new Date(fechaPrimerVoto);
                dateAux = angular.copy(date);
                dateUltimoVoto = new Date(fechaUltimoVoto);
                do {
                    dateFormat = $filter('date')(date, 'yyyy-MM-ddTHH:mm:ss.sssZ');
                    $scope.waitForRender(function () {
                        serviceVoto.votosByFecha.get({f1: date.toISOString()}, function (response) {
                            votos = response.totalVotos;
                            var hora = date.getTime();
                            var horaFormat = $filter('date')(hora, 'mediumTime');
                            dataCategorias.push(horaFormat);
                            dataResults.push(votos);
                            //console.log('categorias', dataCategorias);
                            //console.log('votos', dataResults);
                            date.setMinutes(date.getMinutes() + tiempo);
                            loadGraficoLineChart($scope.getValueStorage('horaVoto'), votantes, dataCategorias, dataResults);
                            callback({r: dataCategorias, f: dataResults});
                        }, function (errorResponse) {
                            $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                        });
                    });
                    dateAux.setMinutes(dateAux.getMinutes() + tiempo);
                    if (dateAux <= dateUltimoVoto) {
                        console.log('');
                    } else if (i === 0) {
                        dateAux.setMinutes(dateAux.getMinutes() + tiempo);
                        i++;
                    } else {
                        flag = false;
                    }
                } while (flag);
            }

            fechasDeVotosRegistrados();

            function fechasDeVotosRegistrados(callback) {
                serviceVoto.fechasVotos.get(function (response) {
                    $scope.fechas = {minVotoFecha: response.minVotoFecha, maxVotoFecha: response.maxVotoFecha};
                    if (callback) {
                        callback($scope.fechas);
                    }
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            function calculoMedia(dataArray) {
                var media = 0, suma = 0;
                dataArray.forEach(function (element) {
                    suma = suma + element;
                });
                media = suma / dataArray.length;
                return media;
            }

            function calculoVarianza(dataArray) {
                var varianza = 0, suma = 0, media = 0;
                media = calculoMedia(dataArray);
                dataArray.forEach(function (element) {
                    suma = suma + Math.pow((element - media), 2);
                });
                varianza = suma / dataArray.length;
                return varianza;
            }

            function desviacionStandar(varianza) {
                return Math.sqrt(varianza);
            }

            function calculoValorK(desviacionStandar, numeroElementos) {
                var k = 0, resultadoParcial = 0;
                resultadoParcial = desviacionStandar / (Math.sqrt(numeroElementos));
                k = z * resultadoParcial;
                return k;
            }

            function loadGraficoLineChart(votantes, horas, categorias, votos) {

                $('#containerLineChart').highcharts({
                    title: {
                        text: 'Resultados',
                        x: -20 //center
                    },
                    xAxis: {
                        categories: categorias,
                        labels: {
                            style: {
                                color: 'red'
                            }
                        },
                        title: {
                            align: 'high',
                            text: 'Tiempo'
                        }
                    },
                    yAxis: {
                        max: horas,
                        title: {
                            align: 'high',
                            text: 'Total de votantes',
                            offset: 0,
                            rotation: 0,
                            y: -10
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    series: [{
                        name: 'votos',
                        data: votos
                    }]
                });
            }

            function containerBandasError(categorias, ranges, averages, nameAverages, index) {
                rango.push(ranges);
                promedios.push(averages);
                var average = {
                    name: nameAverages,
                    data: promedios,
                    zIndex: 1,
                    marker: {
                        fillColor: 'white',
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[index]
                    }
                };
                seriesBarraChart.push(average);
                var range = {
                    name: 'Limites',
                    data: rango,
                    type: 'arearange',
                    lineWidth: 0,
                    linkedTo: ':previous',
                    color: Highcharts.getOptions().colors[index],
                    fillOpacity: 0.3,
                    zIndex: 0
                };
                seriesBarraChart.push(range);
                $('#containerBandasError').highcharts({

                    title: {
                        text: 'July temperatures'
                    },

                    xAxis: {
                        //type: 'datetime'
                        //categories: ['1ff', '2ff', '3ff', '4ff']
                        categories: categorias
                    },

                    yAxis: {
                        title: {
                            text: null
                        }
                    },

                    tooltip: {
                        crosshairs: true,
                        shared: true,
                        valueSuffix: '°C'
                    },

                    legend: {},
                    //
                    //series: [{
                    //    name: 'Temperature',
                    //    data: averages,
                    //    zIndex: 1,
                    //    marker: {
                    //        fillColor: 'white',
                    //        lineWidth: 2,
                    //        lineColor: Highcharts.getOptions().colors[0]
                    //    }
                    //}, {
                    //    name: 'Range',
                    //    data: ranges,
                    //    type: 'arearange',
                    //    lineWidth: 0,
                    //    linkedTo: ':previous',
                    //    color: Highcharts.getOptions().colors[0],
                    //    fillOpacity: 0.3,
                    //    zIndex: 0
                    //}]
                    series: seriesBarraChart
                });
            }

            var ranges = [
                    [1, 14.3, 27.7],
                    [2, 14.5, 27.8],
                    [3, 15.5, 29.6],
                    [4, 16.7, 30.7]
                ],
                averages = [
                    [1, 21.5],
                    [2, 22.1],
                    [3, 23],
                    [4, 23.8]
                ];


            function lineGrafico(dataEjeY) {
                $('#container').highcharts({
                    chart: {
                        type: 'spline',
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                            load: function () {

                                // set up the updating of the chart each second
                                var series = this.series[0];
                                setInterval(function () {
                                    var x = (new Date()).getTime(), // current time
                                        y = dataEjeY;
                                    series.addPoint([x, y], true, true);
                                }, 2000);
                            }
                        }
                    },
                    title: {
                        text: 'Live random data'
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPixelInterval: 150
                    },
                    yAxis: {
                        title: {
                            text: 'Value'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        formatter: function () {
                            return '<b>' + this.series.name + '</b><br/>' +
                                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                                Highcharts.numberFormat(this.y, 2);
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: 'Random data',
                        data: (function () {
                            // generate an array of random data
                            var data = [],
                                time = (new Date()).getTime(),
                                i;

                            for (i = -5; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 1000,
                                    y: dataEjeY
                                });
                            }
                            return data;
                        }())
                    }]
                });
            }
        }
    ]);

}(window.angular));