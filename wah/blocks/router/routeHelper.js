(function () {

    angular.module('blocks.router')
        .provider('routeHelperConfig', function () {
            this.config = {}; //This gets set up in config.js
            this.$get = function () {
                return {
                    config: this.config
                };
            };
        })
        .factory('routeHelper', ['routeHelperConfig',
            function (routeHelperConfig) {

                function configureRoutes(routes) {
                    
                    routes.forEach(function (route) {
                        routeHelperConfig.config.$routeProvider.when(route.url, route.config);
                    });

                    routeHelperConfig.config.$routeProvider.otherwise({ redirectTo: '/' });
                }

                var service = {
                    configureRoutes: configureRoutes
                };



                return service;
            }
        ]);

}());