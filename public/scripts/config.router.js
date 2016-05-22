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

                //General
                .state('app.general', {
                    template: '<div ui-view></div>',
                    abstract: true,
                    url: '/general'
                })
                .state('app.general.provincias', {
                    url: '/provincia',
                    templateUrl: 'views/admin/provincia/provincias.html',
                    controller: 'ProvinciaCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'provincia',
                                    files: [
                                        'scripts/services/provincia.service.js',
                                        'scripts/controllers/provincia.controller.js'
                                    ]
                                }])
                        }]
                    },
                    data: {title: 'CONTAINER.COMMONS.TITLE_PROVINCIAS'}
                })
                .state('app.general.provincia-detail', {
                    url: '/provincia/{id}/canton',
                    templateUrl: 'views/admin/provincia/provincia-detail.html',
                    controller: 'ProvinciaDetailCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'provincia-detail',
                                    files: [
                                        'scripts/services/provincia.service.js',
                                        'scripts/services/provincia.canton.service.js',
                                        'scripts/controllers/provincia-detail.controller.js'
                                    ]
                                }])
                        }]
                    }, data: {title: 'CONTAINER.COMMONS.TITLE_CANTONES'}
                })
                .state('app.general.cantones', {
                    url: '/cantones',
                    templateUrl: 'views/admin/cantones/cantones.html',
                    controller: 'CantonCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'canton',
                                    files: [
                                        'scripts/services/canton.service.js',
                                        'scripts/controllers/canton.controller.js'
                                    ]
                                }])
                        }]
                    },
                    data: {title: 'CONTAINER.COMMONS.TITLE_CANTONES'}
                })
                .state('app.general.canton-detail', {
                    url: '/canton/{id}/parroquia',
                    templateUrl: 'views/admin/cantones/canton-detail.html',
                    controller: 'CantonDetailCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'provincia-detail',
                                    files: [
                                        'scripts/services/canton.service.js',
                                        'scripts/services/canton.parroquia.service.js',
                                        'scripts/controllers/canton-detail.controller.js'
                                    ]
                                }])
                        }]
                    }, data: {title: 'CONTAINER.COMMONS.TITLE_PARROQUIAS'}
                }).
                state('app.general.parroquias', {
                    parent: 'app.general',
                    url: '/parroquias',
                    templateUrl: 'views/admin/parroquias/parroquias.html',
                    controller: 'ParroquiaCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'parroquia',
                                    files: [
                                        'scripts/services/parroquia.service.js',
                                        'scripts/controllers/parroquia.controller.js'
                                    ]
                                }])
                        }]
                    },
                    data: {title: 'CONTAINER.COMMONS.TITLE_PARROQUIAS'}
                }).
                state('app.general.parroquia-detail', {
                    url: '/parroquia/{id}/zona',
                    templateUrl: 'views/admin/parroquias/parroquia-detail.html',
                    controller: 'ParroquiaDetailCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'provincia-detail',
                                    files: [
                                        'scripts/services/parroquia.service.js',
                                        'scripts/services/parroquia.zona.service.js',
                                        'scripts/controllers/parroquia-detail.controller.js'
                                    ]
                                }])
                        }]
                    }, data: {title: 'CONTAINER.COMMONS.TITLE_ZONA'}
                }).
                state('app.general.zonas', {
                    url: '/zonas',
                    templateUrl: 'views/admin/zonas/zonas.html',
                    controller: 'ZonaCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'zona',
                                    files: [
                                        'scripts/services/zona.service.js',
                                        'scripts/controllers/zona.controller.js'
                                    ]
                                }])
                        }]
                    },
                    data: {title: 'CONTAINER.COMMONS.TITLE_ZONA'}
                }).
                state('app.general.zona-detail', {
                    url: '/zona/{id}/recinto',
                    templateUrl: 'views/admin/zonas/zona-detail.html',
                    controller: 'ZonaDetailCtrl as ctrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                {
                                    name: 'provincia-detail',
                                    files: [
                                        'scripts/services/zona.service.js',
                                        'scripts/services/zona.recinto.service.js',
                                        'scripts/controllers/zona-detail.controller.js'
                                    ]
                                }])
                        }]
                    }, data: {title: 'CONTAINER.COMMONS.TITLE_RECINTO'}
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