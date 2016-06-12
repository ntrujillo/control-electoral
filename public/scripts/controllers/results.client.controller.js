(function (angular) {
    angular.module('ControlElectoralApp').controller('ResultsCtrl', ['$scope', 'Junta', 'APP', 'Voto', '$filter', '$http', '$timeout',
        function ($scope, juntaService, constant, serviceVoto, $filter, $http, $timeout) {
            var dataCategorias = [], dataResults = [], votantes = 0, tiempo = 50;

            loadGrafico();
            function loadGrafico() {
                fechasDeVotosRegistrados();
                votosByJunta();
            }

            function votosByJunta() {
                juntaService.Junta.get(function (response) {
                    votantes = response.totalVotantes;
                    console.log('votantes', votantes);
                    $scope.waitForRender(function () {
                        dataVotos($scope.fechas.minVotoFecha, $scope.fechas.maxVotoFecha, function (results) {
                            console.log('dataRenderCategorais', results.r);
                            console.log('dataRenderResults', results.f);
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
                            console.log('categorias', dataCategorias);
                            console.log('votos', dataResults);
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

            function fechasDeVotosRegistrados() {
                serviceVoto.fechasVotos.get(function (response) {
                    $scope.fechas = {minVotoFecha: response.minVotoFecha, maxVotoFecha: response.maxVotoFecha};
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
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
    ])
    ;

}(window.angular));