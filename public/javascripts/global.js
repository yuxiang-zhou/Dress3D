
var currentlyPressedKeys = {};
var z = 300, ySpeed = 0, xloc = 0, yloc = -80;
var human, texture, texture1;

function handleKeyDown(event) {
    // console.log(event.keyCode);
    currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
    if(event.keyCode == 49){
        human.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                child.material.map = texture;

            }

        } );
    }
    if(event.keyCode == 50){
        human.traverse( function ( child ) {

            if ( child instanceof THREE.Mesh ) {

                child.material.map = texture1;

            }

        } );
    }
}
function handleKeys() {
    if (currentlyPressedKeys[87]) {
        // Page Up
        z -= 10;
    }
    if (currentlyPressedKeys[83]) {
        // Page Down
        z += 10;
    }
    if (currentlyPressedKeys[65]) {
        // Left cursor key
        ySpeed -= 0.05;
    }
    if (currentlyPressedKeys[68]) {
        // Right cursor key
        ySpeed += 0.05;
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        yloc += 1;
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
        yloc -= 1;
    }
    if (currentlyPressedKeys[37]) {
        // Up cursor key
        xloc -= 1;
    }
    if (currentlyPressedKeys[39]) {
        // Down cursor key
        xloc += 1;
    }
}

function webGLStart(){
    var container;

    var camera, scene, renderer;

    var mouseX = 0, mouseY = 0;
    var positionX = 0, positionY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;


    init();
    animate();


    function init() {

        container = document.createElement( 'div' );
        document.getElementById('container').appendChild( container );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        camera.position.z = z;

        // scene

        scene = new THREE.Scene();

        var ambient = new THREE.AmbientLight( 0x010101 );
        scene.add( ambient );

        var directionalLight = new THREE.DirectionalLight( 0xffeedd );
        directionalLight.position.set( 0, 0, 1 );
        scene.add( directionalLight );

        // texture

        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {

            console.log( item, loaded, total );

        };

        texture = new THREE.Texture();
        texture1 = new THREE.Texture();

        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        var onError = function ( xhr ) {
        };


        var loader = new THREE.ImageLoader( manager );
        loader.load( 'images/colour0.jpg', function ( image ) {

            texture.image = image;
            texture.needsUpdate = true;

        } );

        loader.load( 'images/colour1.png', function ( image ) {

            texture1.image = image;
            texture1.needsUpdate = true;

        } );

        // model

        var loader = new THREE.OBJLoader( manager );
        loader.load( 'javascripts/three/examples/obj/male02/male02.obj', function ( object ) {
            human = object;
            object.traverse( function ( child ) {

                if ( child instanceof THREE.Mesh ) {

                    child.material.map = texture;

                }

            } );

            object.position.y = yloc;
            object.rotation.y = ySpeed;
            scene.add( object );

        }, onProgress, onError );

        //

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'keydown', handleKeyDown, false );
        document.addEventListener( 'keyup', handleKeyUp, false );
        //

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onDocumentMouseMove( event ) {

        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;

    }

    //

    function animate() {

        requestAnimationFrame( animate );
        handleKeys();
        render();

    }

    function render() {
        human.rotation.y = ySpeed;
        human.position.x = xloc;
        human.position.y = yloc;
        camera.position.x = ( mouseX - camera.position.x ) * .25;
        camera.position.y = ( - mouseY - camera.position.y ) * .25;
        camera.position.z = z;
        // camera.lookAt( scene.position );

        renderer.render( scene, camera );

    }
}


$(function(){
    webGLStart();
});