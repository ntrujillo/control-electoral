angular
    .module('ControlElectoralApp')
    .controller('AppCtrl', ['$scope', '$http', '$localStorage', '$translate',
        function AppCtrl($scope, $http, $localStorage, $translate) {

            $scope.mobileView = 767;

            $scope.app = {
                name: 'Control Electoral',
                author: 'Nyasha',
                version: '1.0.0',
                year: (new Date()).getFullYear(),
                layout: {
                    isSmallSidebar: false,
                    isChatOpen: false,
                    isFixedHeader: true,
                    isFixedFooter: false,
                    isBoxed: false,
                    isStaticSidebar: false,
                    isRightSidebar: false,
                    isOffscreenOpen: false,
                    isConversationOpen: false,
                    isQuickLaunch: false,
                    sidebarTheme: '',
                    headerTheme: ''
                },
                isMessageOpen: false,
                isConfigOpen: false
            };

            $scope.user = window.user || null;

            $scope.setLang = function (langKey) {
                // You can change the language during runtime
                $translate.use(langKey);
            };

            if (angular.isDefined($localStorage.layout)) {
                $scope.app.layout = $localStorage.layout;
            } else {
                $localStorage.layout = $scope.app.layout;
            }

            $scope.$watch('app.layout', function () {
                $localStorage.layout = $scope.app.layout;
            }, true);

            $scope.getRandomArbitrary = function () {
                return Math.round(Math.random() * 100);
            };
        }
    ]).config(['$translateProvider', '$translatePartialLoaderProvider',
        function ($translateProvider, $translatePartialLoaderProvider) {
            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: '../assets/languages/{part}-{lang}.json'
            });
            $translateProvider.preferredLanguage('es_EC');
            $translatePartialLoaderProvider.addPart('app');
        }
    ]);
