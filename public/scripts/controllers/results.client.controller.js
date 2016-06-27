(function (angular) {
    angular.module('ControlElectoralApp').controller('ResultsCtrl', ['$scope', 'Junta', 'APP', 'Voto', '$filter', '$http', '$timeout', 'Lista',
        function ($scope, juntaService, constant, serviceVoto, $filter, $http, $timeout, listaService) {
            var dataCategorias = [], dataResults = [], votantes = 0, tiempo = 10, z = 1.96, categoriasBarraError = [], seriesBarraChart = [], arrayLimites = [], arrayPromedio = [];
            $scope.rangoByGrafico = [];
            $scope.promediosByGrafico = [];
            $scope.dataObject = [];
            $scope.seriesBarError = [];

            $scope.refresh = function () {
                dataCategorias = [];
                dataResults = [];
                $scope.initData();
                $scope.initData2();
            };

            $scope.initData = function () {
                var range, average;
                loadGrafico(function (response) {
                    console.log('respuestaUltimo', response);
                    console.log('respuestaUltimo2');
                    console.log('arrya', $scope.dataObject);
                    $scope.listas.forEach(function (lista, index) {
                        $scope.listas[index].promedio = [];
                        $scope.listas[index].rango = [];
                        $scope.dataObject.forEach(function (data) {
                            if (data.lista.CODE_LISTA === lista.CODE_LISTA) {
                                if (!existeDato($scope.listas[index].promedio, data.promedio)) {
                                    $scope.listas[index].promedio.push(data.promedio);
                                }
                                if (!existeDato($scope.listas[index].rango, data.rango)) {
                                    $scope.listas[index].rango.push(data.rango);
                                }
                            }
                        });
                        average = averageObject(lista.NOM_LISTA, $scope.listas[index].promedio, index);
                        range = rangeObject($scope.listas[index].rango, index);
                        if (!existeSerie($scope.seriesBarError, lista.NOM_LISTA)) {
                            $scope.seriesBarError.push(average);
                            $scope.seriesBarError.push(range);
                        }

                    });
                    containerBandasError('', $scope.seriesBarError);
                    console.log('lista', $scope.listas);
                    console.log('series', $scope.seriesBarError);
                });
            };

            function existeSerie(seriesArray, nameLista) {
                var exste = false;
                seriesArray.forEach(function (serie) {
                    if (angular.isDefined(serie.name) && serie.name === nameLista) {
                        exste = true;
                    }
                });
                return exste;
            }

            function existeDato(array, arrayDato) {
                var exste = false;
                array.forEach(function (dato, index) {
                    if (dato[index] === arrayDato[index]) {
                        exste = true;
                    }
                });
                return exste;
            }

            $scope.initData2 = function () {
                getListas(function (listas) {
                    fechasDeVotosRegistrados(function (fechas) {
                        var fechas = fechasByRecorrer(fechas.minVotoFecha, fechas.maxVotoFecha);
                        for (var i = 0; i < listas.length; i++) {
                            for (var j = 0; j < fechas.length; j++) {
                                calculoDeRangos(listas[i], fechas[j], function (respuesta) {
                                    console.log('respuesta1 ', respuesta);
                                    $scope.dataObject.push(respuesta);
                                });
                            }
                        }
                    });
                });
            };
            //
            function loadGrafico(callback) {
                fechasDeVotosRegistrados(function (fechas) {
                    limitesDeConfianza(fechas.minVotoFecha, fechas.maxVotoFecha, function (response) {
                        callback({
                            response: response,
                            fechaMin: fechas.minVotoFecha,
                            fechaMax: fechas.maxVotoFecha
                        });
                    });
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

            function votos(lista, fechas, callback) {
                var t = [];
                var y = [];
                fechas.forEach(function (fecha) {
                    calculoDeRangos(lista, fecha, function (response) {
                        console.log('callback', response);
                        console.log('a la fecha' + new Date(fecha));
                        t.push(response.promedio);
                        callback(response);
                    });
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
                console.log('fechas.lenght', fechas.length);
                return fechas;
            }

            function limitesDeConfianza(fechaPrimerVoto, fechaUltimoVoto, callback) {
                var fechas = [], promediosA = [], rangosA = [];
                fechas = fechasByRecorrer(fechaPrimerVoto, fechaUltimoVoto);
                getListas(function (listas) {
                    listas.forEach(function (lista, index) {
                        categoriasBarraError = [];
                        promediosA = [];
                        rangosA = [];
                        votos(lista, fechas, function (response) {
                            console.log('votoMetodo', response);
                            if (fechas.length > promediosA.length && fechas.length > rangosA.length) {
                                promediosA.push(response.promedio);
                                rangosA.push(response.rango);
                            }
                            callback({
                                promedios: promediosA,
                                rangos: rangosA,
                                lista: lista
                            });
                        });
                    });
                });
            }

            function averageObject(nameAverages, promedios, index) {
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
                return average;
            }

            function rangeObject(rango, index) {
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
                return range;
            }


            function calculoDeRangos(lista, date, callback) {
                var dateFormat, datos = [], dataInPorcentaje = [], mediana = 0, varianza = 0, desviacionStndr = 0, k = 0, limiteInferior = 0, limiteSuperior = 0, objectRango = [], objectPromedio = [];
                serviceVoto.votosDetalladoListaWithFecha.query({
                    codeLista: lista._id,
                    fecha: date
                }, function (response) {
                    dateFormat = new Date(date);
                    var hora = dateFormat.getTime();
                    var horaFormat = $filter('date')(hora, 'mediumTime');
                    categoriasBarraError.push(horaFormat);

                    console.log('response', response);
                    datos = [];
                    response.forEach(function (voto) {
                        datos.push(voto.VOT_VALIDOS.NUM_VOTOS);
                    });
                    dataInPorcentaje = [];
                    dataInPorcentaje = porcentajeVotos(response, totalVotosALaFecha(response));
                    console.log('lista', lista.NOM_LISTA);
                    mediana = calculoMedia(dataInPorcentaje);
                    varianza = calculoVarianza(dataInPorcentaje);
                    desviacionStndr = desviacionStandar(varianza);
                    k = calculoValorK(desviacionStndr, dataInPorcentaje.length);
                    limiteInferior = parseFloat((mediana - k).toFixed(2));
                    limiteSuperior = parseFloat((mediana + k).toFixed(2));
                    console.log('limiteInferior', limiteInferior);
                    console.log('limiteSuperoir', limiteSuperior);
                    arrayLimites = [lista._id, limiteInferior, limiteSuperior];
                    arrayPromedio = [lista._id, mediana];
                    objectRango = [horaFormat, limiteInferior, limiteSuperior];
                    objectPromedio = [horaFormat, parseFloat((mediana).toFixed(2))];

                    callback({
                        lista: lista,
                        datos: datos,
                        rango: objectRango,
                        promedio: objectPromedio
                    });
                    $scope.dataObject.push({
                        lista: lista,
                        datos: datos,
                        rango: objectRango,
                        promedio: objectPromedio
                    });
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


            function containerBandasError(categorias, seriesBarraChart) {
                $('#containerBandasError').highcharts({

                    title: {
                        text: 'Bandas de error'
                    },

                    xAxis: {
                        //categories: categorias
                    },

                    yAxis: {
                        title: {
                            text: null
                        }
                    },

                    tooltip: {
                        crosshairs: true,
                        shared: true,
                        valueSuffix: ' %'
                    },

                    legend: {},
                    series: seriesBarraChart
                });
            }
        }
    ]);

}(window.angular));