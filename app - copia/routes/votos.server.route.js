var Votos = require('../../app/controllers/votos.server.controller');

module.exports = function (app) {
    //votos Blancos
    app.route('/api/votos/votosBlancos').
        get(Votos.votosBlancoTotal);

    app.route('/api/votos/votosBlancosProvincia/:codeProvince').
        get(Votos.votosBlancoByProvince);

    app.route('/api/votos/votosBlancosCanton/:codeCanton').
        get(Votos.votosBlancoByCanton);

    app.route('/api/votos/votosBlancosParroquia/:codeParroquia').
        get(Votos.votosBlancoByParroquia);

    //votos Nulos
    app.route('/api/votos/votosNulos').
        get(Votos.votosNulosTotal);

    app.route('/api/votos/votosNulosProvincia/:codeProvince').
        get(Votos.votosNulosByProvince);

    app.route('/api/votos/votosNulosCanton/:codeCanton').
        get(Votos.votosNulosByCanton);

    app.route('/api/votos/votosNulosParroquia/:codeParroquia').
        get(Votos.votosNulosByParroquia);

    //votos totales
    app.route('/api/votos/votosTotales').
        get(Votos.votosTotales);

    app.route('/api/votos/votosTotalesProvincia/:codeProvince').
        get(Votos.totalVotosByProvince);

    app.route('/api/votos/votosTotalesCanton/:codeCanton').
        get(Votos.totalVotosByCanton);

    app.route('/api/votos/votosTotalesParroquia/:codeParroquia').
        get(Votos.totalVotosByParroquia);

    //votos por lista
    app.route('/api/votos/votosLista/:codeLista').
        get(Votos.totalVotosLista);

    app.route('/api/votos/votosListaProvince/:codeProvince/:codeLista').
        get(Votos.totalVotosListaProvincia);

    app.route('/api/votos/votosListaCanton/:codeCanton/:codeLista').
        get(Votos.totalVotosListaCanton);

    app.route('/api/votos/votosListaParroquia/:codeParroquia/:codeLista').
        get(Votos.totalVotosListaParroquia);


    app.route('/api/votos').
        post(Votos.saveVoto);

    app.route('/api/votos/:codeProvince').
        get(Votos.countVotBlancos);

};