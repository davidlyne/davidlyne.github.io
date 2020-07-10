(function () {

    var app = angular.module('app');

    app.directive('ciobStaticView', function ($timeout, $document, $sce, $filter, $rootScope, $parse) {
        return {
            restrict: 'E',
            require: "?ngModel",
            link: function (scope, elem, attr, ngModel)  {
                var camera;
                var scene;
                var cube;
                var cubeParent;
                var renderer;
                scope.getFallbackImage = getFallbackImage;
                var lastMouseX=0;
                var lastMouseY=0;
                var mouseSpeedX=0;
                var mouseSpeedY=0;
                var mouseDown=false;
                var theta = 0;
                var beta = 0;
                var frameCount=0;
                var clock;
                var timeDelta=0.016;
                var initialised = false;
                var projector, mouse = { x: 0, y: 0 }, INTERSECTED;
                var infoPoints = [];
                var infoPointsParent;
                var mouseOverInfo = false;
                var mouseScreenPosX = 0;
                var mouseScreenPosY = 0;
                var currentInfoPoint = null;
                var infoPointSelectedColour = 0xDF0000;
                var infoPointCompleteColour = 0x828282;
           
                scope.numInfoPointsVisited = 0;
                scope.numInfoPoints = 0;
                scope.CancelInfo = CancelInfo;
                
                scope.modeEnum = {
                    FALLBACK : 0,
                    CANVAS : 1,
                    WEBGL : 2,
                };
                
                scope.renderMode = scope.modeEnum.FALLBACK;
                scope.infoText = "";
                scope.infoTitle = "";
                scope.mouseInfoEnter = mouseInfoEnter;
                scope.mouseInfoExit = mouseInfoExit;
                
                scope.$watch("section", function(newValue, oldValue) {
                        if (newValue != oldValue) loadBox(newValue, false);
                });
                
                scope.$watch("section.resetEyepoint", function(newValue, oldValue) {
                    if (newValue === true && scope.renderMode === scope.modeEnum.FALLBACK) {
                        scope.section.resetEyepoint = false;
                        continueVideo();    
                    }
                 
                });
                
                // init scene
                init();
                
                function mouseInfoEnter() { 
                    mouseOverInfo = true;                    
                }
                
                function mouseInfoExit() {
                    mouseOverInfo = false;
                }
                
                function ShowInfo(title, content, infoPoint) {
                    
                    if (currentInfoPoint !== null)
                        return;
                    
                    mouseOverInfo = false;
                                        
                    var audio = new Audio("Content/Audio/ShowUI.ogg");
                    audio.volume = 0.2;
                    
                   // if (infoPoint !== null)
                        audio.play();
                        
                    scope.infoText = content;
                    scope.infoTitle = title;
                    
                    currentInfoPoint = null;
                    
     
                    infoPoints.forEach(function(infoPointObject)  {                 
                        if (infoPointObject.iData !== infoPoint)
                            infoPointObject.visible = false; 
                        else {
                            currentInfoPoint = infoPointObject;
                            infoPointObject.visible = true; 
                            infoPointObject.selected = true;
                            infoPointObject.material.color.setHex( infoPointSelectedColour );
                            INTERSECTED = null;
                        }

                    });                        
 
                    
                    scope.controller.showControls = false;
                }
                
                function setOverlayAlpha(alpha) {
                    document.getElementById("overlay").style.backgroundColor = 'rgba(1,1,1,0.3)'.replace(/[^,]+(?=\))/, alpha);
                    scope.controller.overlayFade = alpha;
                    $rootScope.$digest();
                }
                
                function fadeToAltView() {
                    
                    var fadeF = 0.0;
                    var audioPlayed = false;
                    
                    var x = setInterval(function() {
                        var speed = 0.1;   
                        fadeF += speed;

                        setOverlayAlpha(fadeF);
                        if (fadeF > 1.0 && scope.controller.currentSection.altViewAudio.length > 0 && audioPlayed === false) {
                            
                            var audio = new Audio(scope.controller.currentSection.altViewAudio);
                            audio.volume = 0.5;
                            audioPlayed = true;
                            audio.play(); 
                        }
                        if (fadeF > 2.5) {
                       
                             loadBox(scope.controller.currentSection, true);
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
                
                function incrementCounter() {
                    scope.numInfoPointsVisited++;
                    
                    $rootScope.$digest();
                    
                    if (scope.numInfoPointsVisited >= scope.numInfoPoints) {
                        setTimeout(function() {
                            var audio = new Audio("Content/Audio/ShowUI.ogg");
                            audio.volume = 0.2;
                            audio.play(); 
                        }, 200);

                    }   
                }
                
                function CancelInfo() {                   
                    
                    if (currentInfoPoint !== null) {
                        
                        currentInfoPoint.selected = false;
                        currentInfoPoint.complete = true;
                        currentInfoPoint.material.opacity = 0.5;
                        currentInfoPoint.material.color.setHex( infoPointCompleteColour );

                        if (currentInfoPoint.iData.loadAltView === true) {
                            fadeToAltView();
                            
                            setTimeout(function() {
                                incrementCounter();
                            }, 1500);
                        }else {
                            setTimeout(function() {
                                incrementCounter();
                            }, 50);
                        } 
                        
                        currentInfoPoint = null;
                                                
                        console.log("Num Info Points Visited: " + scope.numInfoPointsVisited);
                        
                    }
                    mouseOverInfo = false;
                    scope.infoText = "";
                    scope.infoTitle = "";
                    
                    infoPoints.forEach(function(infoPointObject)  {                 
                        infoPointObject.visible = true; 
                    });
                    
                    scope.controller.showControls = true;
                    console.log("Cancel Info");
                }
                
                function getFallbackImage() {

                    if (scope.renderMode !== scope.modeEnum.FALLBACK)
                        return null;
                    if (!scope.section)
                        return null;
                    return scope.section.mediaPath + "/fallback.jpg";
                }
                
                function trigger360IconAnimation() {
                    console.log("TRIGGER ANIM");
                    var icon = $(".img360");    
                    var animationClassName = "img360Animate";
                    var delayTime = 30;

                    icon.removeClass(animationClassName);
                    // add the class again after some minor delay

                    setTimeout(function() {
                        icon.addClass(animationClassName);
                    }, delayTime);
                  
                }
                
                function postLoad( texture ) {
                    // do something with the texture
                };
            
                function texLoadProgress( xhr ) {
                }
                
                function texLoadError( xhr ) {
                    scope.controller.ShowError("A connection error has been detected.  Please exit and try again later");
                }
                
                function getCubeTexture(textureLoader, path) {
                    var tex = textureLoader.load(path, postLoad, texLoadProgress, texLoadError);
                    return tex;  
                }
                
                function loadBox(section, isAlt) {
                    
                    
                    if (scope.renderMode === scope.modeEnum.FALLBACK)
                            return;
                    
                    frameCount=0;
                    
                    if (isAlt === false) {
                        theta = (section.angleY+180) * (3.14 / 180);
                        beta = (section.angleX) * (3.14 / 180);

                        theta = wrapAngle(theta);
                        beta = wrapAngle(beta);

                        mouseSpeedX=0;
                        mouseSpeedY=0;   
                    } 

                    if (isAlt === false) {
                        if (cubeParent) scene.remove(cubeParent);   
                    }else {
                        if (cube) cubeParent.remove(cube);  
                    }
       
                    var textureLoader = new THREE.TextureLoader();
                    var cubeTextures = [];
                    var mediaPath = section.mediaPath;
                    
                    if (isAlt) {
                        mediaPath += "/Alt";
                    }

                    cubeTextures.push(getCubeTexture(textureLoader, mediaPath + '/PosX.jpg'));
                    cubeTextures.push(getCubeTexture(textureLoader, mediaPath + '/NegX.jpg'));
                    cubeTextures.push(getCubeTexture(textureLoader, mediaPath + '/PosY.jpg'));
                    cubeTextures.push(getCubeTexture(textureLoader, mediaPath + '/NegY.jpg'));
                    cubeTextures.push(getCubeTexture(textureLoader, mediaPath + '/PosZ.jpg'));
                    cubeTextures.push(getCubeTexture(textureLoader, mediaPath + '/NegZ.jpg'));

                    var materials = [
                            new THREE.MeshBasicMaterial( { map: cubeTextures[0], side: THREE.FrontSide, overdraw: true  } ),
                            new THREE.MeshBasicMaterial( { map: cubeTextures[1], side: THREE.FrontSide, overdraw: true  } ),
                            new THREE.MeshBasicMaterial( { map: cubeTextures[2], side: THREE.FrontSide, overdraw: true  } ),
                            new THREE.MeshBasicMaterial( { map: cubeTextures[3], side: THREE.FrontSide, overdraw: true  } ),
                            new THREE.MeshBasicMaterial( { map: cubeTextures[4], side: THREE.FrontSide, overdraw: true  } ),
                            new THREE.MeshBasicMaterial( { map: cubeTextures[5], side: THREE.FrontSide, overdraw: true  } )
                    ];         

                    
                    var geometry;
                    
                    if (scope.renderMode === scope.modeEnum.CANVAS)
                        geometry = new THREE.BoxGeometry(80, 80, 80, 20, 20, 20);
                    else
                        geometry = new THREE.BoxGeometry(80, 80, 80, 3, 3, 3);

                    cube = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
                    
                    if (isAlt === false) {
                        cubeParent = new THREE.LOD();
                    }
                    
                    cubeParent.add( cube );
                    
                    if (isAlt === false) {
                        scene.add( cubeParent );
                    }

                    
                    if (isAlt === false) {
                        infoPointsParent = new THREE.LOD();
                        cubeParent.add(infoPointsParent);

                        generateInfoPoints(infoPointsParent, section);

                        if (section.note.length > 0)
                            ShowInfo(section.title, section.note, null);
                        else
                            CancelInfo();

                        trigger360IconAnimation();    
                    }

                }

                function generateInfoPoints(cube, section) {
                    
                    scope.numInfoPointsVisited = 0;
                    scope.numInfoPoints = section.infoPointData.length;
                    
                    var textureLoader = new THREE.TextureLoader();
                    infoPoints = [];
                                        
                    var infoPointDistance = 15.0;                    
 
                    var infoTexture = textureLoader.load("Content/img/Inspect_Info.png");
                    var hazardTexture = textureLoader.load("Content/img/Inspect_Hazard.png");
                     
                    section.infoPointData.forEach(function(iData)  {
                        var squareGeometry = new THREE.Geometry(); 
                        squareGeometry.vertices.push(new THREE.Vector3(-1.0,  1.0, infoPointDistance)); 
                        squareGeometry.vertices.push(new THREE.Vector3( 1.0,  1.0, infoPointDistance)); 
                        squareGeometry.vertices.push(new THREE.Vector3( 1.0, -1.0, infoPointDistance)); 
                        squareGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, infoPointDistance)); 

                        squareGeometry.faceVertexUvs[0].push( [
                            new THREE.Vector2 (0,1),
                            new THREE.Vector2 (1,1),
                            new THREE.Vector2 (1,0)
                        ] );
                        squareGeometry.faceVertexUvs[0].push( [
                            new THREE.Vector2 (0,1),
                            new THREE.Vector2 (0,0),
                            new THREE.Vector2 (1,0)
                        ] );
                        squareGeometry.faces.push(new THREE.Face3(0, 1, 2)); 
                        squareGeometry.faces.push(new THREE.Face3(0, 3, 2));

                        var tex = infoTexture;
                        if (iData.isHazard)
                            tex = hazardTexture;
                        
                        var material = new THREE.MeshBasicMaterial( { map: tex, side: THREE.DoubleSide, overdraw: true, transparent: true });


                        var infomesh = new THREE.Mesh( squareGeometry, material );
                        infomesh.rotation.x = iData.angleX  * (Math.PI / 180);
                        //infomesh.rotation.y = iData.angleY  * (Math.PI / 180);
                        infomesh.iData = iData;
                        infomesh.selected = false;
                        infomesh.complete = false;
                        var infoMeshParent = new THREE.LOD();
                        infoMeshParent.rotation.y = iData.angleY  * (Math.PI / 180);
                        
                        
                        infoMeshParent.add(infomesh);
                        
                        infoPoints.push(infomesh);
                        cubeParent.add(infoMeshParent) 
                    });

 
                }
                
                setTimeout(function() {
                    loadBox(scope.section, false);
                }, 1);
                
                
                
                animate();
           
                function detectBrowsers() {
                    scope.renderMode = scope.modeEnum.WEBGL;
                    /*if (detectIOS())
                    {
                        scope.renderMode = scope.modeEnum.FALLBACK;  
                        return;
                    }
                    var ieVersion = detectIE();
                    if (ieVersion === false && webglAvailable()) {
                        scope.renderMode = scope.modeEnum.WEBGL;
                    }else if (ieVersion > 11 && webglAvailable()) {
                        scope.renderMode = scope.modeEnum.WEBGL;
                    }else if (ieVersion > 9 && isCanvasSupported()) {
                        scope.renderMode = scope.modeEnum.CANVAS;
                    }else if (ieVersion === false && isCanvasSupported()) {
                        scope.renderMode = scope.modeEnum.CANVAS;
                    }else
                        scope.renderMode = scope.modeEnum.FALLBACK;  */                  
                }
                
                function init() {
             
                        detectBrowsers();
                        initialised = true;
                        
                        if (scope.renderMode === scope.modeEnum.FALLBACK)
                            return;
                        clock = new THREE.Clock();
                        camera = new THREE.PerspectiveCamera(51, window.innerWidth / window.innerHeight, 1, 2000);
                        camera.position.set(0, 0, 0);
                        scene = new THREE.Scene();
 
                        // Renderer
                        if (scope.renderMode === scope.modeEnum.CANVAS)
                            renderer = new THREE.CanvasRenderer();
                        else
                            renderer = new THREE.WebGLRenderer();
                        if (elem.parent()[0])
                            renderer.setSize(elem.parent()[0].offsetWidth, elem.parent()[0].offsetHeight);
                        elem[0].appendChild(renderer.domElement);

                        // Events
                        window.addEventListener('resize', onWindowResize, false);
                        window.addEventListener( 'mousedown', onDocumentMouseDown, false );
                        window.addEventListener( 'touchstart', onDocumentTouchStart, false );
                        window.addEventListener( 'touchend', onDocumentTouchEnd, false );
                        window.addEventListener( 'touchmove', onDocumentTouchMove, false );
                        window.addEventListener( 'mousemove', onDocumentMouseMove, false );
                        // initialize object to perform world/screen calculations
                        projector = new THREE.Projector();
        
                        onWindowResize(null);
                        
                        console.log("INIT");
                        //$rootScope.$digest();
                }


                //
                function onWindowResize(event) {
                        if (elem.parent()[0]) {
                            renderer.setSize(elem.parent()[0].offsetWidth, elem.parent()[0].offsetHeight);
                            camera.aspect = elem.parent()[0].offsetWidth / elem.parent()[0].offsetHeight;                            
                        }

                        camera.updateProjectionMatrix();
                }
                
                function onDocumentMouseDown( event ) {
                        if (scope.controller.lockMouse===true)
                            return;
                        if (mouseOverInfo===true)
                            return;
                        if (INTERSECTED === null)
                        {
                            event.preventDefault();
                           // window.addEventListener( 'mousemove', onDocumentMouseMove, false );
                            window.addEventListener( 'mouseup', onDocumentMouseUp, false );
                            window.addEventListener( 'mouseout', onDocumentMouseOut, false );
                            mouseDown = true;
                            lastMouseX = event.clientX;
                            lastMouseY = event.clientY;
                            mouseScreenPosY = lastMouseY;
                            mouseScreenPosX = lastMouseX;
                            
                            mouseSpeedX = 0;
                            mouseSpeedY = 0;
                        
                        }
                        

                        if (INTERSECTED) {
                            ShowInfo(INTERSECTED.iData.title, INTERSECTED.iData.text, INTERSECTED.iData);
                            //console.log("Set info text: " + scope.infoText);                           
                        }
                        
                        scope.$apply();
                        
                }
                function onDocumentMouseMove( event ) {
                    if (scope.controller.lockMouse===true)
                            return;

                    if (mouseDown) {
                        mouseScreenPosX = event.clientX;
                        mouseScreenPosY = event.clientY;

                    }

                    var mouseX = event.clientX - ((window.innerWidth - elem.parent()[0].offsetWidth) * 0.5);
                    var mouseY = event.clientY - ((window.innerHeight - elem.parent()[0].offsetHeight) * 0.5);
               
                    mouse.x = ( mouseX / elem.parent()[0].offsetWidth) * 2 - 1;
                    mouse.y = - ( mouseY/ elem.parent()[0].offsetHeight ) * 2 + 1;

                }
                
                function onDocumentMouseUp( event ) {
                        if (scope.controller.lockMouse===true)
                                return;

                        mouseDown = false;
                       // window.removeEventListener( 'mousemove', onDocumentMouseMove, false );
                        window.removeEventListener( 'mouseup', onDocumentMouseUp, false );
                        window.removeEventListener( 'mouseout', onDocumentMouseOut, false );
                }
                function onDocumentMouseOut( event ) {

                }
                
                function delayShowInfo() {
                    if (INTERSECTED) {
                        ShowInfo(INTERSECTED.iData.title, INTERSECTED.iData.text, INTERSECTED.iData);
                        scope.$apply();                          
                    }

                }
                
                function onDocumentTouchStart( event ) {
                    if (scope.controller.lockMouse===true)
                            return;
                    if (mouseOverInfo===true)
                            return;

                    if ( event.touches.length === 1 ) {    
                        
                        var mouseX = event.touches[ 0 ].pageX - ((window.innerWidth - elem.parent()[0].offsetWidth) * 0.5);
                        var mouseY = event.touches[ 0 ].pageY - ((window.innerHeight - elem.parent()[0].offsetHeight) * 0.5);

                        mouse.x = ( mouseX / elem.parent()[0].offsetWidth) * 2 - 1;
                        mouse.y = - ( mouseY/ elem.parent()[0].offsetHeight ) * 2 + 1;
                    
                        detectInfoPoint();
                        
                        if (INTERSECTED === null) {
                            mouseDown = true;
                            lastMouseX = event.touches[ 0 ].pageX;
                            lastMouseY = event.touches[ 0 ].pageY;
                            mouseScreenPosY = lastMouseY;
                            mouseScreenPosX = lastMouseX;
                            mouseSpeedX = 0;
                            mouseSpeedY = 0;
                        }

                        setTimeout(function() {
                            delayShowInfo();
                        }, 1);
                

                    }
                    scope.$apply();
                }
                function onDocumentTouchMove( event ) {
            
                    event.preventDefault();
                    //        return;
                    if (scope.controller.lockMouse===true)
                            return;
                    if ( event.touches.length === 1) {
                            mouseScreenPosX = event.touches[ 0 ].pageX;
                            mouseScreenPosY = event.touches[ 0 ].pageY;

                    }
                    if ( event.touches.length === 1) {
                        var mouseX = event.touches[ 0 ].pageX - ((window.innerWidth - elem.parent()[0].offsetWidth) * 0.5);
                        var mouseY = event.touches[ 0 ].pageY - ((window.innerHeight - elem.parent()[0].offsetHeight) * 0.5);

                        mouse.x = ( mouseX / elem.parent()[0].offsetWidth) * 2 - 1;
                        mouse.y = - ( mouseY/ elem.parent()[0].offsetHeight ) * 2 + 1;
                    }

                }
                
                function onDocumentTouchEnd( event ) {
                    if (scope.controller.lockMouse===true)
                                return;
                    mouseDown = false;
                }

                //
                var t = 0;

                function animate() {
                        if (scope.renderMode === scope.modeEnum.FALLBACK)
                            return;
                        timeDelta = clock.getDelta();
                        requestAnimationFrame(animate);
                        render();
                }
                
                function continueVideo() {
                    scope.section.resetEyepoint = false;
                    scope.controller.videoMode = true;
                    scope.controller.videoPlayPause();    
                    
             
                }
                
                var f = 0;
                
                function wrapAngle(angle) {
                    if (angle > (Math.PI))
                        angle = angle - (Math.PI*2);
                    else if (angle < -(Math.PI))
                        angle = angle + (Math.PI*2);    
                    return angle;
                }
                
                function clampAngle(angle, min, max) {
                    min = min * (Math.PI / 180);
                    max = max * (Math.PI / 180);
                    if (angle > max)
                        angle = max;
                    else if (angle < min)
                        angle = min;
                    return angle;
                }
                
                function detectInfoPoint() {
                        var raycaster = new THREE.Raycaster(); // create once              
                        raycaster.setFromCamera( mouse, camera );

                        var intersects = raycaster.intersectObjects( infoPoints );
                        if ( intersects.length > 0 )
                        {

                                // if the closest object intersected is not the currently stored intersection object
                                if ( intersects[ 0 ].object != INTERSECTED && intersects[ 0 ].object.complete === false) 
                                {
                                    // restore previous intersection object (if it exists) to its original color
                                        if ( INTERSECTED ) 
                                                INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
                                        // store reference to closest object as current intersection object
                                        INTERSECTED = intersects[ 0 ].object;
                                        // store color of closest object (for later restoration)
                                        INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                                        // set a new color for closest object
                                        INTERSECTED.material.color.setHex( infoPointSelectedColour );
                                }
                        } 
                        else // there are no intersections
                        {
                                // restore previous intersection object (if it exists) to its original color
                                if ( INTERSECTED ) 
                                        INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
                                // remove previous intersection object reference
                                //     by setting current intersection object to "nothing"
                                INTERSECTED = null;
                        }

                }
                
                var thetaTarget;
                var betaTarget;
                                
                function render() {         
                    
                        
                        if (!mouseDown) {
                           mouseSpeedX *= 0.9/(60.0*timeDelta); 
                           mouseSpeedY *= 0.9/(60.0*timeDelta); 
                        }else {
                            mouseSpeedX = mouseScreenPosX - lastMouseX;
                            mouseSpeedY = mouseScreenPosY - lastMouseY;                     
                            lastMouseX = mouseScreenPosX;
                            lastMouseY = mouseScreenPosY;
                        }                
                        
                        theta += mouseSpeedX*0.15*timeDelta;
                        beta += mouseSpeedY*0.15*timeDelta;
                        
                        theta = wrapAngle(theta);
                        beta = wrapAngle(beta);
                        
                        beta = clampAngle(beta,-70,50);
                        
                        var beta2 = beta;
                        var theta2 = theta;
                        
                        if (scope.section.fadeAtImageEnd === false) {
                            if (scope.section.resetEyepoint === true) {
                                if (f === 0.0) {
                                    thetaTarget = (scope.section.angleY+180) * (Math.PI / 180);
                                    betaTarget = (scope.section.angleX) * (Math.PI / 180);
                                    
                                    if ((thetaTarget - theta) > THREE.Math.degToRad( 180.0 )) {
                                        thetaTarget -= THREE.Math.degToRad( 360.0 );
                                    }
                                }

                                thetaTarget = wrapAngle(thetaTarget);
                                betaTarget = wrapAngle(betaTarget);

                                f += timeDelta*1.5;
                                if (f > 1.0)
                                    f = 1.0;

                                
                                beta2 = smoothLerp(beta, betaTarget, f);
                                theta2 = smoothLerp(theta, thetaTarget, f);
                                if (f>=1.0 || (thetaTarget === theta && betaTarget === beta)) {
                                    scope.section.resetEyepoint = false;
                                    continueVideo();
                                    $rootScope.$digest();
                                }

                            }else
                                f = 0;
                        }

                        if (cubeParent !== undefined) {
                            cubeParent.scale.x = -1;
                            cubeParent.rotation.x = beta2;
                            cubeParent.rotation.y = theta2;
                        }


                        
                        renderer.render(scene, camera);                        

                        detectInfoPoint();
                        
                        if (frameCount < 2)
                            renderer.domElement.hidden = true;
                        else
                            renderer.domElement.hidden = false;
                        
                        frameCount++;
                }
                
            },
            templateUrl:'directives/ciobStaticView.html',
            scope: {
                section: '=',
                controller: '=',
            }
        };
    });

}());