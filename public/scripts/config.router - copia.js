angular.module('example').config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/signin.html'
            }).
            when('/container', {
                templateUrl: 'views/example.client.view.html'
            }).
            otherwise({
                redirectTo: 'container.html'
            });
    }]);