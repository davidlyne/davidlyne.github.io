(function () {
    'use strict';

    function getRoutes() {

        var config = {
            templateUrl: 'features/main/main.html',
            controller: 'main',
            controllerAs: 'mainVm',
            title: 'CIOB',
            siteSection: 'main'
        };

        return [
            {
                url: '/main',
                config: config
            }
        ];
    }

    angular
        .module('app.main')
        .run([
            'routeHelper', function routeConfig(routehelper) {
                routehelper.configureRoutes(getRoutes());
            }
        ]);
}());


