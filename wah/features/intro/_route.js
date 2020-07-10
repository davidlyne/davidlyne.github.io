(function () {
    'use strict';

    function getRoutes() {

        var config = {
            templateUrl: 'features/intro/intro.html',
            controller: 'intro',
            controllerAs: 'introVm',
            title: 'intro',
            siteSection: 'intro'
        };

        return [
            {
                url: '/intro',
                config: config
            }
        ];
    }

    angular
        .module('app.intro')
        .run([
            'routeHelper', function routeConfig(routehelper) {
                routehelper.configureRoutes(getRoutes());
            }
        ]);
}());


