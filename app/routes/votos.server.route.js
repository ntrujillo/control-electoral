var Votos = require('../../app/controllers/votos.server.controller'),
    usuario = require('../../app/controllers/users.server.controller');

module.exports = function (app) {
    //votos Blancos
    app.route('/api/votos/votosBlancos').
        get(usuario.requiresLogin, Votos.votosBlancoTotal);

    app.route('/api/votos/votosBlancosProvincia/:codeProvince').
        get(usuario.requiresLogin, Votos.votosBlancoByProvince);

    app.route('/api/votos/votosBlancosCanton/:codeCanton').
        get(usuario.requiresLogin, Votos.votosBlancoByCanton);

    app.route('/api/votos/votosBlancosParroquia/:codeParroquia').
        get(usuario.requiresLogin, Votos.votosBlancoByParroquia);

    app.route('/api/votos/votosBlancosFiltro').
        get(usuario.requiresLogin, Votos.votosBlancoFiltro);

    //votos Nulos
    app.route('/api/votos/votosNulos').
        get(usuario.requiresLogin, Votos.votosNulosTotal);

    app.route('/api/votos/votosNulosProvincia/:codeProvince').
        get(usuario.requiresLogin, Votos.votosNulosByProvince);

    app.route('/api/votos/votosNulosCanton/:codeCanton').
        get(usuario.requiresLogin, Votos.votosNulosByCanton);

    app.route('/api/votos/votosNulosParroquia/:codeParroquia').
        get(usuario.requiresLogin, Votos.votosNulosByParroquia);

    app.route('/api/votos/votosNulosFiltro').
        get(usuario.requiresLogin, Votos.votosNulosFiltro);

    //votos totales
    app.route('/api/votos/votosTotales').
        get(usuario.requiresLogin, Votos.votosTotales);

    app.route('/api/votos/votosTotalesProvincia/:codeProvince').
        get(usuario.requiresLogin, Votos.totalVotosByProvince);

    app.route('/api/votos/votosTotalesCanton/:codeCanton').
        get(usuario.requiresLogin, Votos.totalVotosByCanton);

    app.route('/api/votos/votosTotalesParroquia/:codeParroquia').
        get(usuario.requiresLogin, Votos.totalVotosByParroquia);

    app.route('/api/votos/votosTotalesFiltro').
        get(usuario.requiresLogin, Votos.votosTotalesFiltro);

    //votos por lista
    app.route('/api/votos/votosLista/:codeLista').
        get(usuario.requiresLogin, Votos.totalVotosLista);

    app.route('/api/votos/votosListaProvince/:codeProvince/:codeLista').
        get(usuario.requiresLogin, Votos.totalVotosListaProvincia);

    app.route('/api/votos/votosListaCanton/:codeCanton/:codeLista').
        get(usuario.requiresLogin, Votos.totalVotosListaCanton);

    app.route('/api/votos/votosListaParroquia/:codeParroquia/:codeLista').
        get(usuario.requiresLogin, Votos.totalVotosListaParroquia);

    app.route('/api/votos/totalVotosListaFiltro').
        get(usuario.requiresLogin, Votos.totalVotosListaFiltro);


    app.route('/api/votos').
        get(usuario.requiresLogin, Votos.getVoto).
        post(usuario.requiresLogin, Votos.saveVoto);

    app.route('/api/votos/:codeProvince').
        get(usuario.requiresLogin, Votos.countVotBlancos);

    app.route('/api/votos/votosByFecha/:f1').
        get(Votos.getVotosByFecha);

    app.route('/api/votos/fecha/fechasVotos').
        get(Votos.getMinMaxFechaVoto);


};