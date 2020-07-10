(function () {
    'use strict';

    angular
        .module('app.intro')
        .controller('intro', [
            '$q', '$routeParams', '$scope', '$filter', '$location','$rootScope',
            function ($q, $routeParams, $scope, $filter, $location, $rootScope, $document) {
                var introVm = this;
                
                var bgVideo = document.getElementById('videoPlayer');
                
                init();
              
                function init() {			
                }
                
                function onVideoEnded() {
                    bgVideo.pause();
                    bgVideo.currentTime = 0;
                    bgVideo.load();
                }
                bgVideo.addEventListener('ended', onVideoEnded, false);
                
                ///////// Responsive Layout Stuff: maybe this should be in it's own script instead? /////////////////////////
                
                ///// Element references /////
                var fourByThreeFrame = document.getElementById("fourByThreeFrame");

                var currentWidth, currentHeight, fourThreeWidth, fourThreeHeight, bodyFontSize;

                ///// Resize repsonsively on page load and on viewport resize /////
                function resizeView() {
                    currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                    currentHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

                    // landscape or portrait
                    if (currentWidth > currentHeight * 1.3333) {
                            fourThreeWidth = Math.round(currentHeight * 1.3333);
                            fourThreeHeight = Math.round(fourThreeWidth * 0.75);
                    } else {
                            fourThreeHeight = Math.round(currentWidth * 0.75);
                            fourThreeWidth = Math.round(fourThreeHeight * 1.3333);
                    }

                    // main outer frame
                    fourByThreeFrame.style.width = fourThreeWidth + "px";
                    fourByThreeFrame.style.height = fourThreeHeight + "px";

                    // body font size
                    if (fourThreeWidth < 501) {
                            bodyFontSize = 12;
                    }
                    if (fourThreeWidth > 500) {
                            bodyFontSize = 16;
                    }
                    if (fourThreeWidth > 650) {
                            bodyFontSize = 20;
                    }
                    if (fourThreeWidth > 800) {
                            bodyFontSize = 24;
                    }
                    if (fourThreeWidth > 950) {
                            bodyFontSize = 28;
                    }
                    if (fourThreeWidth > 1100) {
                            bodyFontSize = 32;
                    }
                    if (fourThreeWidth > 1250) {
                            bodyFontSize = 36;
                    }
                    if (fourThreeWidth > 1400) {
                            bodyFontSize = 40;
                    }
                    document.body.style.fontSize = bodyFontSize + "px";
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