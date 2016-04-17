(function (angular) {
    angular.module('ControlElectoralApp').factory('Notification', ['growl', '$filter', function (growl, $filter) {

        var notification = {};
        notification.showErrorWithFilter = function (message, title, time) {
            var sms = $filter('translate')(message);
            setTimeout(function () {
                growl.error(sms, {title: title}, {ttl: time});
            }, 100);
        };
        return notification;
    }]);

}(window.angular));