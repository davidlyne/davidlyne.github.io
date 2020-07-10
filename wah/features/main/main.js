(function () {
    'use strict';

    angular
        .module('app.main')
        .controller('main', [
            '$q', '$routeParams', '$scope', '$filter', '$location','$rootScope',
            function ($q, $routeParams, $scope, $filter, $location, $rootScope, $document) {
                var mainVm = this;
                // add things (functions, values, etc to mainVM namespace if you want to access them in your html
                mainVm.testShow = true;
                mainVm.setCurrentSection = setCurrentSection;
                mainVm.buttonHover = buttonHover;
                mainVm.videoPlayPause = videoPlayPause;
                mainVm.toggleDocPopUp = toggleDocPopUp;
                mainVm.debug = function() {console.log("Ping!");}
                mainVm.exit = exit;
                mainVm.mouseDown = mouseDown;
                mainVm.mouseUp = mouseUp;
                mainVm.mouseLeave = mouseLeave;
                
                mainVm.sections = getSections();
                
                // initialize start state variables
                mainVm.currentSection = intro;
                mainVm.currentButtonHover = null;
                mainVm.currentNote = "Start";
                mainVm.videoMode = false;
                mainVm.videoPlayback = false;
                mainVm.docOpen = false;
                mainVm.numLocationsVisited=0;
                mainVm.lockMouse=false;
                mainVm.showControls = true;
                mainVm.fadeToSection = fadeToSection;
                mainVm.overlayFade = 0;
                mainVm.Begin = Begin;
                mainVm.started = false;
                var MaxSections = 7;
                mainVm.MaxSections = MaxSections;
                mainVm.Restart = Restart;
                mainVm.skipVideo = skipVideo;
                mainVm.errorMessage = "";
                mainVm.teleport = teleport;
                mainVm.ShowError = ShowError;
                mainVm.Quit = Quit;
                
                init();
                
                function init() {
                    mainVm.videoPlayback = false;                    
                    document.getElementById("overlay").style.backgroundColor = 'rgba(1,1,1,0.3)'.replace(/[^,]+(?=\))/, 1.0);
                    setTimeout(fadeFromBlack,1);
                    setTimeout(checkWebGl,100);
                    setInterval(checkNetworkState, 1000);
                     
                }
                
                function iOSversion() {
                    if (/iP(hone|od|ad)/.test(navigator.platform)) {
                      // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
                      var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                      return parseInt(v[1], 10);//[parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
                    }else {
                        return -1;
                    }
                }

                function checkNetworkState() {
                    var networkState = document.getElementById('videoPlayer').networkState;
                    if (networkState == 3) {
                        ShowError("A connection error has been detected.  Please exit and try again later");    
                    }                    
                }
                
                function checkWebGl() {
                    if (webglAvailable() === false) {
                        ShowError("Browser unsupported.  Please upgrade your browser.");
                    }else {
                        var iosver = iOSversion();

                        if (iosver >= 0 && iosver <= 8) {
                            ShowError("IOS version unsupported. Please update your Apple device."); 
                        }
                    }

                        
                       
                }
                
                function ShowError(err) {
                    mainVm.errorMessage = err;
                    $scope.$digest();  
                }
                function exit() {
                    window.removeEventListener("resize", resizeView);
                    document.getElementById('videoPlayer').removeEventListener('ended', onVideoEnded, false);
                    document.getElementById('videoPlayer').removeEventListener('error', onVideoError);
                    
                    document.getElementById("videoPlayer").pause();
                    $location.path("/intro");
                }
		
                function skipVideo() {
                    document.getElementById("videoPlayer").pause();
                    setCurrentSection(mainVm.sections[mainVm.currentSection.stepNumber]);
                }
                
                function teleport() {
                    var videoPlayer = document.getElementById("videoPlayer");

                    if ((mainVm.currentSection.teleportTime > 0) && (videoPlayer.currentTime > mainVm.currentSection.teleportTime)) {
                        videoPlayer.pause();
                        setCurrentSection(mainVm.sections[mainVm.currentSection.stepNumber]);
                    }else {
                        videoPlayer.play();
                    }
                }
                
                function Quit() {
                    window.close();    
                }
                
                function setVideoFilename() {
                    document.getElementById("videoPlayer").src = mainVm.currentSection.mediaPath + "video.mp4";
                }
                
                function setOverlayAlpha(alpha) {
                    document.getElementById("overlay").style.backgroundColor = 'rgba(1,1,1,0.3)'.replace(/[^,]+(?=\))/, alpha);
                    mainVm.overlayFade = alpha;
                    $scope.$digest();
                }
                function fadeFromBlack() {
                    var speed = 0.1;  
                    setOverlayAlpha(1.0);
                    var fadeF2 = 0.0;

                    var y = setInterval(function() {

                    setOverlayAlpha(1.0 - fadeF2);

                    fadeF2 += speed;
                    if (fadeF2 > 1.0) {

                         setOverlayAlpha(0.0);
                         clearInterval(y);

                    }
                    }, 33);    
                }
                                
                function fadeToSection(section) {
                    
                    if (mainVm.overlayFade !== 0.0)
                        return;
                    
                    var fadeF = 0.0;
                    var x = setInterval(function() {
                    var speed = 0.1;   
                    fadeF += speed;
                    
                    setOverlayAlpha(fadeF);
                    
                    if (fadeF > 1.0) {
                         setCurrentSection(section);
                         setOverlayAlpha(1.0);
                         clearInterval(x);
                         
                         var fadeF2 = 0.0;
                         
                         var y = setInterval(function() {
                       
                         setOverlayAlpha(1.0 - fadeF2);
                     
                        fadeF2 += speed;
                        if (fadeF2 > 1.0) {
                        
                             setOverlayAlpha(0.0);
                             clearInterval(y);

                        }
                        }, 33);
                         
                    }
                    }, 33);
                }
                
                function fadeToPlayVideo() {
                    
                    var fadeF = 0.0;
                    var x = setInterval(function() {
                    var speed = 0.1;   
                    fadeF += speed;
                    
                    setOverlayAlpha(fadeF);
                    
                    if (fadeF > 1.0) {
                        
                         mainVm.videoMode = true;
                         mainVm.videoPlayPause(); 
                         
                         setOverlayAlpha(1.0);
                         clearInterval(x);
                         
                         var fadeF2 = 0.0;
                         
                         var y = setInterval(function() {
                       
                         setOverlayAlpha(1.0 - fadeF2);
                     
                        fadeF2 += speed;
                        if (fadeF2 > 1.0) {
                        
                             setOverlayAlpha(0.0);
                             clearInterval(y);

                        }
                        }, 33);
                         
                    }
                    }, 33);
                }
                
                function fadeOutThenRestart() {
                    
                    var fadeF = 0.0;
                    var x = setInterval(function() {
                    var speed = 0.1;   
                    fadeF += speed;
                    
                    setOverlayAlpha(fadeF);
                    
                    if (fadeF > 1.0) {
                            
                         setOverlayAlpha(1.0);
                         clearInterval(x);
                         
                         location.reload();
                         
                    }
                    }, 33);
                }
                
                function setCurrentSection(section) {
                    
                    if (section !== intro) {
                        if (section.visited===false) {           
                            section.visited = true;
                            mainVm.numLocationsVisited++;
                            
                            if (mainVm.numLocationsVisited >= (MaxSections-1)) {
                                console.log("Course complete");
                                SCORMComplete();
                            }
                        }
                    }
                    
                    if (section.audio !== null) {
                        console.log("Play audio: " + section.audio);
                        var audio = new Audio(section.audio);
                        audio.volume = 0.5;
                        audio.play();
                    }

                    mainVm.currentSection = section;
                    mainVm.currentSection.resetEyepoint = false;
                    mainVm.currentNote = section.note;
                    mainVm.videoMode = false;
                    mainVm.videoPlayback = false;
                    mainVm.started = false;
                    if (section.stepNumber < mainVm.sections.length) {
                        // switch video player to current src here unless it's the final button which has no video
                        
                        // Delay to prevent flicker
                        setTimeout(setVideoFilename,250);
                    }
                    if (mainVm.docOpen === true) mainVm.docOpen = false;
                }
                
                function buttonHover(section) {
                    if (detectIOS())
                        return;
                    mainVm.currentButtonHover = section;
                }
                
                function mouseDown() {
                    mainVm.lockMouse = true;
                }
                
                function mouseUp() {
                    mainVm.lockMouse = false;
                }
                
                function mouseLeave() {
                    mainVm.lockMouse = false;
                }
                
                function Restart() {
                    fadeOutThenRestart();
                }
                
                function Begin() {
                    var audio = new Audio('Content/Audio/ambient.ogg');
                    audio.volume = 0.08;
                    audio.loop = true;
                    audio.play();
                    
                    mainVm.started = true;
                    videoPlayPause();    
                }
                
                function videoPlayPause() {
			
                    if (mainVm.videoPlayback === false) {
                        // For mobile we need to play the video on click once...
                        document.getElementById("videoPlayer").play();
                        document.getElementById("videoPlayer").pause();
                        // ...
                        if (mainVm.videoMode === true) {
                            mainVm.videoMode = true;
                            mainVm.videoPlayback = true;
                            document.getElementById("videoPlayer").play();
                        }else {
                            if (mainVm.currentSection.fadeAtImageEnd === false) {
                               mainVm.currentSection.resetEyepoint = true; 
                            }else {
                                fadeToPlayVideo();  
                            }

                        }
                        
                    } else {
                        mainVm.videoPlayback = false;
                        // Pause html5 video element
                        document.getElementById("videoPlayer").pause();
                        }
                }
                
                function onVideoEnded() {
                    if (mainVm.currentSection.fadeAtVideoEnd)
                        fadeToSection(mainVm.sections[mainVm.currentSection.stepNumber]);
                    else
                        setCurrentSection(mainVm.sections[mainVm.currentSection.stepNumber]);
                    // force re-digest
                    $rootScope.$digest();
                }
                
                function onVideoError(err) {
                    ShowError("A connection error has been detected.  Please exit and try again later");
                }
                
                document.getElementById('videoPlayer').addEventListener('ended', onVideoEnded, false);
                document.getElementById('videoPlayer').addEventListener('error', onVideoError, false);

                function toggleDocPopUp() {
                    mainVm.docOpen = !mainVm.docOpen;
                }
                
                
                
                ///////// Responsive Layout Stuff: maybe this should be in it's own script instead? /////////////////////////
                
                ///// Element references /////
                var fourByThreeFrame = document.getElementById("fourByThreeFrame");
                var leftStripUI = document.getElementById("leftStripUI");
                var numberButtons = document.getElementsByClassName("button");

                var currentWidth, currentHeight, fourThreeWidth, fourThreeHeight, buttonHeight, bodyFontSize;

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
                    // left strip UI
                    if (leftStripUI !== null)
                        leftStripUI.style.height = fourThreeHeight + "px";

                    // number buttons
                    for (var i=0; i < numberButtons.length; i++) {
                            buttonHeight = leftStripUI.offsetWidth * 0.6667;
                            numberButtons[i].style.height = buttonHeight + "px";
                            numberButtons[i].style.lineHeight = buttonHeight + "px";
                    }

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