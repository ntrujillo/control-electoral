angular
    .module('ControlElectoralApp')
    .controller('AppCtrl', ['$scope', '$http', '$localStorage', '$translate', 'Notification', 'APP',
        function AppCtrl($scope, $http, $localStorage, $translate, notification, constants) {

            $scope.mobileView = 767;

            $scope.notification = notification;

            $scope.setValueStorage = function (key, value) {
                window.sessionStorage.setItem(key, JSON.stringify(value));
            };

            $scope.getValueStorage = function (key) {
                return JSON.parse(window.sessionStorage.getItem(key));
            };

            $scope.removeValueStorage = function (key) {
                window.sessionStorage.removeItem(key);
            };

            $scope.clearStorage = function () {
                window.sessionStorage.clear();
            };

            $scope.rolMenu = $scope.getValueStorage(constants.CONTEXT.ROL);

            $scope.$on('to_parent', function (event, data) {
                $scope.rolMenu = data;
            });

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
    ]).config(['$translateProvider', '$translatePartialLoaderProvider', 'growlProvider',
        function ($translateProvider, $translatePartialLoaderProvider, growlProvider) {
            $translateProvider.useLoader('$translatePartialLoader', {
                urlTemplate: '../assets/languages/{part}-{lang}.json'
            });
            $translateProvider.preferredLanguage('es_EC');
            $translatePartialLoaderProvider.addPart('app');

            //alerts
            growlProvider.globalTimeToLive({success: 1000, error: 0, warning: 1000, info: 1000});
            growlProvider.onlyUniqueMessages(false);
            growlProvider.globalDisableCountDown(true);
        }
    ]);
