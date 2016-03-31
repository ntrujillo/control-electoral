(function (angular) {
    'use strict';
    var app = angular.module('ControlElectoralApp', ['ngResource', 'ngRoute', 'example', 'users']);
    //  angular.module('Controllers', []);
    // angular.module('Services', []);

    /*app.run(['$rootScope', 'ENV', 'VERSION', 'TITLE', function ($rootScope, ENV, VERSION, TITLE) {
     $rootScope.ENV = ENV;
     $rootScope.VERSION = VERSION;
     $rootScope.TITLE = TITLE;

     }]);*/

    app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('!');
    }]);

    if (window.location.hash === '#_=_') window.location.hash = '#!';

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['ControlElectoralApp']);
    });
}(window.angular));