(function (angular) {
    angular.module('ControlElectoralApp').controller('ResultsCtrl', ['$scope', 'Junta', 'APP', 'Voto', '$filter', '$http', '$timeout', 'Lista',
        function ($scope, juntaService, constant, serviceVoto, $filter, $http, $timeout, listaService) {
            var dataCategorias = [], dataResults = [], dataProcentajeJuntas = [], votantes = 0, labelsEjeX = [],
                tiempo = 10, z = 1.96, categoriasBarraError = [],
                numeroJuntas = 0, arrayLimites = [], arrayPromedio = [];
            $scope.rangoByGrafico = [];
            $scope.promediosByGrafico = [];
            $scope.dataObject = [];
            $scope.seriesBarError = [];
            $scope.dataResultados = [];
            $scope.votosTotales = 0;

            getVotosTotales();

            function getVotosTotales() {
                serviceVoto.votosTotales.get(function (response) {
                    $scope.votosTotales = response.votosTotales;
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            $scope.refresh = function () {
                dataCategorias = [];
                dataResults = [];
                dataProcentajeJuntas = [];
                labelsEjeX = [];
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
                                if (!existeDato($scope.listas[index].promedio, data.promedio[0])) {
                                    $scope.listas[index].promedio.push(data.promedio);
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
                    labelsEjeX = getLabelsEjeX($scope.listas[0]);
                    containerBandasError(labelsEjeX, $scope.seriesBarError);
                    console.log('lista', $scope.listas);
                    console.log('seriesBAndas', $scope.seriesBarError);
                    $scope.listas.forEach(function (lista) {
                        loadTableResult($scope.fechas.maxVotoFecha, lista);
                    });
                    loadBandasError(labelBandasError(angular.copy($scope.seriesBarError)), seriesLoadBandasError(angular.copy($scope.seriesBarError)), labelsEjeX);
                });
                console.log('ultimo2');
            };

            function getLabelsEjeX(lista) {
                var labels = [];
                if (angular.isDefined(lista.promedio)) {
                    lista.promedio.forEach(function (promedio) {
                        labels.push(promedio[0]);
                    });
                }
                return labels;
            }

            function labelBandasError(series) {
                var labelArray = [], title, objectLabel;
                for (var i = 0; i < series.length; i = i + 2) {
                    objectLabel = {
                        labels: {
                            format: '{value} %',
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        },
                        title: {
                            text: '',
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        }

                    };
                    //labelArray.push(label);
                    title = {
                        title: {
                            text: '',
                            style: {
                                color: Highcharts.getOptions().colors[i]
                            }
                        }
                    };
                    labelArray.push(objectLabel);
                }
                return labelArray;
            }

            function seriesLoadBandasError(series) {
                var seriesArray = [], serie;
                series.forEach(function (element, index) {
                    serie = {
                        data: []
                    };
                    if (index % 2 === 0) {
                        serie.name = element.name;
                        serie.type = 'spline';
                        serie.tooltip = {pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} % </b>'};
                        element.data.forEach(function (data) {
                            serie.data.push(data[1]);
                        });
                        seriesArray.push(serie);
                    } else {
                        serie.type = 'errorbar';
                        serie.tooltip = {
                            pointFormat: '(error range: {point.low}-{point.high} %)<br/>'
                        };
                        element.data.forEach(function (data) {
                            serie.data.push(data);
                        });
                        seriesArray.push(serie);
                    }
                });
                return seriesArray;
            }

            function existeListaTable(dataResults, codeLista) {
                var exste = false;
                dataResults.forEach(function (result) {
                    if (result.lista.CODE_LISTA === codeLista) {
                        exste = true;
                    }
                });
                return exste;
            }

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
                array.forEach(function (dato) {
                    if (dato[0] === arrayDato) {
                        exste = true;
                    }
                });
                return exste;
            }

            $scope.initData2 = function () {
                getListas(function (listas) {
                    fechasDeVotosRegistrados(function (fechasRango) {
                        var fechas;
                        fechas = fechasByRecorrer(fechasRango.minVotoFecha, fechasRango.maxVotoFecha);
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
                getNumeroJuntas();
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
                    listas.forEach(function (lista) {
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
                var average;
                average = {
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
                var range;
                range = {
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

            function loadTableResult(fechaUltima, lista) {
                var ultimaFecha = new Date(fechaUltima), datos, mediana = 0, varianza = 0, desviacionStndr = 0, k, limiteInferior, limiteSuperior;
                ultimaFecha.toISOString();
                ultimaFecha.setMinutes(ultimaFecha.getMinutes() + tiempo);
                serviceVoto.votosDetalladoListaWithFecha.query({
                    codeLista: lista._id,
                    fecha: ultimaFecha
                }, function (response) {
                    datos = [];
                    response.forEach(function (voto) {
                        datos.push(voto.VOT_VALIDOS.NUM_VOTOS);
                    });
                    mediana = transformaPorcentajeInNumber($scope.votosTotales, (calculoMedia(datos) * 100));
                    //mediana = (calculoMedia(datos) * 100);
                    varianza = calculoVarianza(datos, mediana);
                    desviacionStndr = desviacionStandar(varianza);
                    k = calculoValorK(desviacionStndr, $scope.votosTotales);
                    limiteInferior = parseFloat((mediana - k).toFixed(2));
                    limiteSuperior = parseFloat((mediana + k).toFixed(2));
                    //artificio para que no se repitan los resultados
                    if (!existeListaTable($scope.dataResultados, lista.CODE_LISTA)) {
                        $scope.dataResultados.push({
                            lista: lista,
                            limiteInferior: limiteInferior.toFixed(0),
                            promedio: mediana.toFixed(0),
                            limiteSuperior: limiteSuperior.toFixed(0)
                        });
                    }

                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
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
                    //dataInPorcentaje = porcentajeVotos(response, $scope.votosTotales);
                    console.log('lista', lista.NOM_LISTA);
                    mediana = (calculoMedia(datos)) * 100;
                    varianza = calculoVarianza(datos, mediana);
                    desviacionStndr = desviacionStandar(varianza);
                    k = calculoValorK(desviacionStndr, $scope.votosTotales);
                    limiteInferior = parseFloat((mediana - k).toFixed(2));
                    limiteSuperior = parseFloat((mediana + k).toFixed(2));
                    console.log('limiteInferior', limiteInferior);
                    console.log('limiteSuperoir', limiteSuperior);
                    arrayLimites = [lista._id, limiteInferior, limiteSuperior];
                    arrayPromedio = [lista._id, mediana];
                    objectRango = [limiteInferior, limiteSuperior];
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
                        });
                    });
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            function getNumeroJuntas() {
                juntaService.getNumeroJuntas.get(function (responseNumeroJuntas) {
                    numeroJuntas = responseNumeroJuntas.juntas;
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
                var date, dateUltimoVoto, dateFormat, votos = 0, flag = true, i = 0, dateAux,
                    juntasALaFecha = 0;
                date = new Date(fechaPrimerVoto);
                dateAux = angular.copy(date);
                dateUltimoVoto = new Date(fechaUltimoVoto);
                do {
                    dateFormat = $filter('date')(date, 'yyyy-MM-ddTHH:mm:ss.sssZ');
                    $scope.waitForRender(function () {
                        serviceVoto.votosByFecha.get({f1: date.toISOString()}, function (response) {
                            votos = response.totalVotos;
                            juntasALaFecha = response.totalJuntas;
                            var hora = date.getTime();
                            var horaFormat = $filter('date')(hora, 'mediumTime');
                            dataCategorias.push(horaFormat);
                            dataResults.push(votos);
                            dataProcentajeJuntas.push(parseFloat(((juntasALaFecha * 100) / numeroJuntas).toFixed(2)));
                            date.setMinutes(date.getMinutes() + tiempo);
                            loadGraficoLineChart('containerLineChartPorcentaje', parseFloat(((numeroJuntas * 100) / numeroJuntas).toFixed(2)), dataCategorias, dataProcentajeJuntas, {
                                titleY: '%',
                                titleSerie: 'porcentaje'
                            });
                            loadGraficoLineChart('containerLineChart', votantes, dataCategorias, dataResults, {
                                titleY: 'Total votantes',
                                titleSerie: 'votos'
                            });
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
                var media, suma = 0;
                dataArray.forEach(function (element) {
                    suma = suma + element;
                });
                media = suma / $scope.votosTotales;
                return media;
            }

            function calculoVarianza(dataArray, valorMediana) {
                var varianza, suma = 0, media = 0;
                if (angular.isDefined(valorMediana)) {
                    media = valorMediana;
                } else {
                    media = calculoMedia(dataArray);
                }
                dataArray.forEach(function (element) {
                    suma = suma + Math.pow((element - media), 2);
                });
                varianza = suma / $scope.votosTotales;
                return varianza;
            }

            function desviacionStandar(varianza) {
                return Math.sqrt(varianza);
            }

            function calculoValorK(desviacionStandar, numeroElementos) {
                var k, resultadoParcial;
                resultadoParcial = desviacionStandar / (Math.sqrt(numeroElementos));
                k = z * resultadoParcial;
                return k;
            }

            function transformaPorcentajeInNumber(totalData, porcentajeATransformar) {
                var number;
                number = (totalData * porcentajeATransformar) / 100;
                return parseFloat(number.toFixed(2));

            }

            function loadGraficoLineChart(nameGrafico, horas, categorias, votos, options) {

                $('#' + nameGrafico).highcharts({
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
                            text: options.titleY,
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
                    tooltip: {
                        valueSuffix: ' %'
                    },
                    series: [{
                        name: options.titleSerie,
                        data: votos
                    }]
                });
            }

            function loadBandasError(yArrayError, seriesBarError, categorias) {
                $('#BandasError').highcharts({
                    title: {
                        text: 'Bandas de error'
                    },
                    xAxis: [{
                        categories: categorias
                    }],
                    yAxis: yArrayError,

                    tooltip: {
                        shared: true
                    },

                    series: seriesBarError
                });
            }

            function containerBandasError(categorias, seriesBarraChart) {
                $('#containerBandasError').highcharts({

                    title: {
                        text: 'Bandas de error'
                    },

                    xAxis: {
                        categories: categorias
                        //type: 'datetime'
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