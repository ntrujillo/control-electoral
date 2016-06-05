(function (angular) {
    'use strict';
    angular.module('ControlElectoralApp').factory('Voto', ['$resource', function ($resource) {
        var service = $resource('/api/votos', {query: {method: "GET", isArray: true}});
        service.SaveVoto = $resource('/api/votos');

        service.votosBlancoTotal = $resource('/api/votos/votosBlancos');
        service.votosBlancoByProvince = $resource('/api/votos/votosBlancosProvincia/:codeProvince');
        service.votosBlancoByCanton = $resource('/api/votos/votosBlancosCanton/:codeCanton');
        service.votosBlancoByParroquia = $resource('/api/votos/votosBlancosParroquia/:codeParroquia');
        service.votosBlancoFiltro = $resource('/api/votos/votosBlancosFiltro');

        service.votosNulosTotal = $resource('/api/votos/votosNulos');
        service.votosNulosByProvince = $resource('/api/votos/votosNulosProvincia/:codeProvince');
        service.votosNulosByCanton = $resource('/api/votos/votosNulosCanton/:codeCanton');
        service.votosNulosByParroquia = $resource('/api/votos/votosNulosParroquia/:codeParroquia');
        service.votosNulosFiltro = $resource('/api/votos/votosNulosFiltro');

        service.votosTotales = $resource('/api/votos/votosTotales');
        service.totalVotosByProvince = $resource('/api/votos/votosTotalesProvincia/:codeProvince');
        service.totalVotosByCanton = $resource('/api/votos/votosTotalesCanton/:codeCanton');
        service.totalVotosByParroquia = $resource('/api/votos/votosTotalesParroquia/:codeParroquia');
        service.votosTotalesFiltro = $resource('/api/votos/votosTotalesFiltro');

        service.totalVotosLista = $resource('/api/votos/votosLista/:codeLista');
        service.totalVotosListaProvincia = $resource('/api/votos/votosListaProvince/:codeProvince/:codeLista');
        service.totalVotosListaCanton = $resource('/api/votos/votosListaCanton/:codeCanton/:codeLista');
        service.totalVotosListaParroquia = $resource('/api/votos/votosListaParroquia/:codeParroquia/:codeLista');
        service.totalVotosListaFiltro = $resource('/api/votos/totalVotosListaFiltro');


        return service;

    }]);

}(window.angular));