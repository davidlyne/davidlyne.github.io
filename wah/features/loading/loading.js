(function () {
    'use strict';

    angular
        .module('app.loading')
        .controller('loading', [
            '$q', '$routeParams', '$scope', '$filter', '$location','$rootScope','preloader',
            function ($q, $routeParams, $scope, $filter, $location, $rootScope, preloader, $document) {
                var loadingVm = this;
		loadingVm.imageLoadCallback = imageLoadCallback;
                loadingVm.loadingPercentDone = 0;
                init();
                
                function imageLoadCallback(percentDone) {
                    loadingVm.loadingPercentDone = parseInt(percentDone);
                }
                
                function init() {
                    // Just load it straight away - needs to be changed to occur after load of images
                    //$location.path("/main");
                    var sections = getSections();
                    var images = [];
                    sections.forEach(function(section) {
                        images.push(section.mediaPath + "fallback.jpg");
                        images.push(section.mediaPath + "/PosX.jpg");
                        images.push(section.mediaPath + "/NegX.jpg");
                        images.push(section.mediaPath + "/PosY.jpg");
                        images.push(section.mediaPath + "/NegY.jpg");
                        images.push(section.mediaPath + "/PosZ.jpg");
                        images.push(section.mediaPath + "/NegZ.jpg");
                        if (section.hasAltView === true) {
                            images.push(section.mediaPath + "/Alt/fallback.jpg");
                            images.push(section.mediaPath + "/Alt/PosX.jpg");
                            images.push(section.mediaPath + "/Alt/NegX.jpg");
                            images.push(section.mediaPath + "/Alt/PosY.jpg");
                            images.push(section.mediaPath + "/Alt/NegY.jpg");
                            images.push(section.mediaPath + "/Alt/PosZ.jpg");
                            images.push(section.mediaPath + "/Alt/NegZ.jpg");
                        }
                    });
                    
                    console.log("num images to preload: " + images.length);
                    
                    preloader.preloadImages( images, loadingVm ).then(function() {
                        $location.path("/main");
                        sectionsPreLoaded=true;
                    },
                    function() {
                        // Failed but load anyway...
                        $location.path("/main");
                        sectionsPreLoaded=true;
                    });
  
                }
                
                ///////// Responsive Layout Stuff: maybe this should be in it's own script instead? /////////////////////////
                
                ///// Element references /////
                var fourByThreeFrame = document.getElementById("fourByThreeFrame");

                var currentWidth, currentHeight, fourThreeWidth, fourThreeHeight, bodyFontSize;

                ///// Resize repsonsively on page load and on viewport resize /////
                function resizeView() {
                     currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    currentHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                    var aspectRatio = (16.0/9.0);
                    // landscape or portrait
                    if (currentWidth > (currentHeight * aspectRatio)) {
                            fourThreeWidth = Math.round(currentHeight * aspectRatio);
                            fourThreeHeight = Math.round(fourThreeWidth * (1.0/aspectRatio));
                    } else {
                            fourThreeHeight = Math.round(currentWidth * (1.0/aspectRatio));
                            fourThreeWidth = Math.round(fourThreeHeight * aspectRatio);
                    }

                    // main outer frame
                    fourByThreeFrame.style.width = fourThreeWidth + "px";
                    fourByThreeFrame.style.height = fourThreeHeight + "px";
                    fourByThreeFrame.style.left = (currentWidth - fourThreeWidth)/2.0 + "px";
                    fourByThreeFrame.style.top = (currentHeight - fourThreeHeight)/2.0 + "px";


                    document.body.style.fontSize = (fourThreeHeight * 0.0466) + "px";
                }
                window.addEventListener("resize", resizeView);
                // calling resize here (onload) prevents the entire page from loadng at the wrong height but is too early 
                // to catch dynamic angular stuff liek the side UI buttons. therefore calling it again with a timeout will
                // then catch the dynamic stuff. Not ideal performance wise but best result so far.
                angular.element($document).onload = resizeView();
                setTimeout(resizeView,0);
                
                ////////////////////////////////////End Responsive Layout Stuff ////////////////////////////////////////////
            }
        ]);
}());