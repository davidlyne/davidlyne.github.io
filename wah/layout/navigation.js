(function () {

    angular.module('app').directive('navigation', ['$rootScope', '$route', '$timeout', '$location',
        function ($rootScope, $route, $timeout, $location) {
            
                    
            return {
                restrict: 'E',
                templateUrl: 'layout/navigation.html',
                scope: {
                    
                },
                link: function (scope) {
                    scope.overlayEnabled=false;
                    
                    function disableOverlay() {
                        scope.overlayEnabled = false;
                        $rootScope.$digest();
                    }
                    
                    scope.activeSection = $route.current.$$route.siteSection;
                    
                    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
                        scope.overlayEnabled = true;
                        setTimeout(disableOverlay,500);                   
                    });
                  
                }
            };
        }
    ]);

}());