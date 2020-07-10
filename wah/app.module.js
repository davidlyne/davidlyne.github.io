(function () {
    'use strict';

    angular.module('app', [
        // Angular modules 

        //TODO: Antonino to investigate delay with ng-show/ng-if logic when this is not commented out
        //'ngAnimate',
        'ngRoute',
        // Custom modules 
        'app.core',
        'app.main',
        'app.loading',
        'app.intro',    
    ]);
}());