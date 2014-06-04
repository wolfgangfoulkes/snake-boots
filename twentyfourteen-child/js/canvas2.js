

jQuery(document).ready
(function($){
                       
    // Set up the scene, camera, and renderer as global variables.
    //doesn't change anything if these are globals
    var scene,
    camera,
    renderer,
    $container,
    width,
    height,
    /**
    * Our internal callbacks object - a neat
    * and tidy way to organise the various
    * callbacks in operation.
    */
    callbacks = {
    windowResize: function() {
        if(renderer)
        {
            width			= $container.width(),
            height			= $container.height(),
            camera.aspect 	= width / height,
            renderer.setSize(width, height);
            
            camera.updateProjectionMatrix();
            console.log("width:", width,"height", height)
        }
    }
    };

    init();
    animate();

    // Sets up the scene.
    function init()
    {

    console.log("console test\n");
    // Create the scene and set the scene size.

    $container = $("#container"),
    scene = new THREE.Scene();
    width = $container.width();
    height = $container.height();

    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(width, height);
    $container.append(renderer.domElement);

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
    camera.position.set(0,6,0);
    scene.add(camera);


    // Set the background color of the scene.
    renderer.setClearColor(new THREE.Color(0xFF0000));

    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);

    // Add OrbitControls so that we can pan around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //Load in the mesh and add it to the scene.
    /*
    var loader = new THREE.JSONLoader();
    loader.load( "models/treehouse_logo.js", function(geometry){
    var material = new THREE.MeshLambertMaterial({color: 0x55B663});
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    });
     */

    var radius = 16,
    segments = 30,
    rings = 30;

    var material = new THREE.MeshLambertMaterial({color: 0x55B663});
    var sphere = new THREE.Mesh(
                                new THREE.SphereGeometry(
                                radius,
                                segments,
                                rings),
                                material);
    scene.add(sphere);

    //add custom callback to window.resize
    $(window).resize(callbacks.windowResize);

    /* for updating vertices
    // set the geometry to dynamic
    // so that it allow updates
    sphere.geometry.dynamic = true;

    // changes to the vertices
    sphere.geometry.verticesNeedUpdate = true;

    // changes to the normals
    sphere.geometry.normalsNeedUpdate = true;
     */

    }


    // Renders the scene and updates the render as needed.
    function animate()
    {
    // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame(animate);

    // Render the scene.
    renderer.render(scene, camera);
    controls.update();
    }
 

});
