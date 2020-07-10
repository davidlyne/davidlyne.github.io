(function () {
    'use strict';

    function getRoutes() {

        var config = {
            templateUrl: 'features/loading/loading.html',
            controller: 'loading',
            controllerAs: 'loadingVm',
            title: 'CIOB',
            siteSection: 'loading'
        };

        return [
            {
                url: '/',
                config: config
            }
        ];
    }

    angular
        .module('app.loading')
        .run([
            'routeHelper', function routeConfig(routehelper) {
                routehelper.configureRoutes(getRoutes());
            }
        ]);
}());


