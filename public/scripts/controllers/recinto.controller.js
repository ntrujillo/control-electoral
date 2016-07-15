(function (angular) {
    angular.module('ControlElectoralApp')
        .controller('RecintoCtrl', ['RecintoResource', '$scope', 'APP', function (ServiceResource, $scope, constant) {
            var ctrl = this;
            ctrl.registros = [];
            ctrl.pageno = 1;
            ctrl.total_count = 0;
            ctrl.itemsPerPage = 10;

            function loadData(page) {
                ServiceResource.query({
                    page: page,
                    per_page: ctrl.itemsPerPage,
                    q: ctrl.code,
                    sort: 'name',
                    filterName: ctrl.filterName,
                    isFilterOr: true
                }, function (result, headers) {
                    ctrl.registros = result;
                    ctrl.total_count = headers('X-Total-Count');
                }, function (errorResponse) {
                    $scope.notification.showErrorWithFilter(errorResponse.data.message, constant.COMMONS.ERROR);
                });
            }

            function refresh() {
                loadData(ctrl.pageno);
            }

            ctrl.refresh = refresh;
            ctrl.loadData = loadData;
            ctrl.refresh();
        }]);
}(window.angular));