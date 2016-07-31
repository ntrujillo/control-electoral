angular
    .module('ControlElectoralApp', [
        'ui.router',
        'ui.bootstrap',
        'ui.grid',
        'ui.grid.exporter',
        'oc.lazyLoad',
        'ngStorage',
        'ngResource',
        'pascalprecht.translate',
        'angular-growl',
        'ngAnimate',
        'ngAria',
        'ngMessages',
        'ngMaterial',
        "kendo.directives",
        "angularUtils.directives.dirPagination"

    ])
    .constant('COLORS', {
        'default': '#e2e2e2',
        primary: '#09c',
        success: '#2ECC71',
        warning: '#ffc65d',
        danger: '#d96557',
        info: '#4cc3d9',
        white: 'white',
        dark: '#4C5064',
        border: '#e4e4e4',
        bodyBg: '#e0e8f2',
        textColor: '#6B6B6B'
    })
    .constant('APP', {
        'ROL': {
            'ADMINISTRADOR': 1,
            'COORDINADOR': 2,
            'USUARIO': 3
        },
        'CONTEXT': {
            'ROL': 'rolUser'
        },
        'COMMONS': {
            'ERROR': 'Error!'
        }
    });