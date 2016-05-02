(function (angular) {
    angular.module('ControlElectoralApp').factory('Notification', ['growl', '$filter', function (growl, $filter) {

        var notification = {};
        notification.showErrorWithFilter = function (message, title, time) {
            var titleMessage = $filter('translate')(title);
            var sms = $filter('translate')(message);
            setTimeout(function () {
                growl.error(sms, {title: titleMessage}, {ttl: time});
            }, 300);
        };
        notification.info = function (message, title, time) {
            var titleMessage = $filter('translate')(title);
            var sms = $filter('translate')(message);
            setTimeout(function () {
                growl.info(sms, {title: titleMessage}, {ttl: time});
            }, 100);
        };
        notification.success = function (message, title, time) {
            var titleMessage = $filter('translate')(title);
            var sms = $filter('translate')(message);
            setTimeout(function () {
                growl.success(sms, {title: titleMessage}, {ttl: time});
            }, 100);
        };
        return notification;
    }]);

}(window.angular));