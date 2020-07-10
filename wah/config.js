(function () {

    var app = angular.module('app');

    app.run([
        '$rootScope',
        function ($rootScope) {
            $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

                if (current.hasOwnProperty('$$route')) {
                    $rootScope.title = current.$$route.title;
                }
            });
        }
    ]);
    
    
}());