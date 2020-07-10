(function () {

    var core = angular.module('app.core');

    core.config(['$routeProvider', 'routeHelperConfigProvider', function ($routeProvider, routeHelperConfigProvider) {

        var routeConfig = routeHelperConfigProvider;
        routeConfig.config.$routeProvider = $routeProvider;



    }]);
}());