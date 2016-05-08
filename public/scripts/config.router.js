angular
    .module('ControlElectoralApp')
    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on('$stateChangeSuccess', function () {
                window.scrollTo(0, 0);
            });
            FastClick.attach(document.body);
        }
    ])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            // For unmatched routes
            $urlRouterProvider.otherwise('/');

            // Application routes
            $stateProvider
                .state('app', {
                    abstract: true,
                    templateUrl: 'views/common/layout.html'
                })

                .state('app.users', {
                    url: '/usuarios',
                    templateUrl: 'views/admin/users.html',
                    controller: 'UserCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'angular-factory',
                                    files: [
                                        'scripts/models/User.js',
                                        'scripts/services/admin/user.client.service.js',
                                        'scripts/controllers/admin/user.client.controller.js'
                                    ]
                                }]);
                        }]
                    },
                    data: {
                        title: 'CONTAINER.ADMIN.ADMINISTRATOR_USERS'
                    }
                })
                .state('app.roles', {
                    url: '/roles',
                    templateUrl: 'views/admin/roles/roles.html',
                    controller: 'RolCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'angular-factory',
                                    files: [
                                        'scripts/models/Rol.js',
                                        'scripts/services/admin/roles/roles.client.service.js',
                                        'scripts/controllers/admin/roles/roles.client.controller.js'
                                    ]
                                }]);
                        }]
                    },
                    data: {
                        title: 'CONTAINER.ADMIN.ADMINISTRATOR_ROLES'
                    }
                })
                .state('app.resultados', {
                    url: '/container',
                    templateUrl: 'views/results-filter.html',
                    controller: 'FiltroCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'angular-factory',
                                    files: [
                                        'scripts/services/filtro-busqueda.client.service.js',
                                        'scripts/services/lista.client.service.js',
                                        'scripts/services/votos.client.service.js',
                                        'scripts/controllers/filtro-busqueda.client.controller.js'
                                    ]
                                }]);
                        }]
                    },
                    data: {
                        title: 'Resultados'
                    }
                })

                // UI Routes
                .state('app.ui', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/ui'
                })
                .state('app.ui.directives', {
                    url: '/registro',
                    templateUrl: 'views/entry.html',
                    controller: 'EntryCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'angular-factory',
                                    files: [
                                        'factory/factory-genero.js',
                                        'scripts/services/province.client.service.js',
                                        'scripts/services/canton.client.service.js',
                                        'scripts/services/parroquia.client.service.js',
                                        'scripts/services/zona.client.service.js',
                                        'scripts/services/recinto.client.service.js',
                                        'scripts/services/junta.client.service.js',
                                        'scripts/controllers/entry.js'
                                    ]
                                }]);
                        }]
                    },
                    data: {
                        title: 'Registro de votos'
                    }
                })

                .state('user', {
                    templateUrl: 'views/common/session.html'
                })
                .state('user.signin', {
                    url: '/',
                    templateUrl: 'views/signin.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    files: ['/scripts/controllers/session.js']
                                }
                            ]);
                        }]
                    },
                    data: {
                        appClasses: 'bg-white usersession',
                        contentClasses: 'full-height'
                    }
                })
                .state('user.authorization', {
                    url: '/authorization',
                    templateUrl: 'views/authorization.html',
                    controller: 'AuthorizationCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    files: [
                                        'scripts/services/authorization.client.service.js',
                                        'scripts/controllers/authorization.client.controller.js'
                                    ]
                                }]);
                        }]
                    },
                    data: {
                        appClasses: 'bg-white user-authorization',
                        contentClasses: 'full-height'
                    }
                })
                .state('user.forgot', {
                    url: '/forgot',
                    templateUrl: 'views/extras-forgot.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load('/scripts/controllers/session.js');
                        }]
                    },
                    data: {
                        appClasses: 'bg-white usersession',
                        contentClasses: 'full-height'
                    }
                });
        }
    ])
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: false
        });
    }]);