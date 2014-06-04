

                                           

jQuery(document).ready(function($)
{
    var camera,
    callbacks,
    scene 				= new THREE.Scene();
    renderer            = new THREE.WebGLRenderer();
    $container 			= $('#container');
    width				= $container.width();
    height				= $container.height();
    vshader             = $("shader-vert");
    fshader             = $("shader-frag");
    shaderMaterial      = new THREE.ShaderMaterial({
                                               vertexShader: vshader.text(),
                                               fragmentShader: fshader.text()
                                               });
    
    renderer.setSize(width, height);
    $container.append(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(
                                        45,
                                        width / height,
                                        1,
                                        -1000
                                         );
    scene.add(camera)
    
    meshInit();
                       
    lightInit();
    
    // add listeners
    addEventListeners();
    
    // start rendering, which will
    // do nothing until the mesh is loaded
    update();

function meshInit()
{
    // set up the sphere vars
    var radius = 50,
    segments = 16,
    rings = 16;
    
    // create a new mesh with
    // sphere geometry - we will cover
    // the sphereMaterial next!
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(
                                                         50,
                                                         16,
                                                         16),
                                shaderMaterial);
    
    // add the sphere to the scene
    scene.add(sphere);
}

function lightInit()
{
    var pointLight =
    new THREE.PointLight(0xFFFFFF);
    
    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;
    
    // add to the scene
    scene.add(pointLight);
}

function addEventListeners()
{
    // window event
    $(window).resize(callbacks.windowResize());
    
}

function update()
{
    // set up a request for a render
    requestAnimationFrame(render);
}

/**
 * Renders the current state
 */
function render()
{
    // only render
    if(renderer) {
        renderer.render(scene, camera);
    }
    
    // set up the next frame
    update();
}

windowResize() {
    if(renderer)
    {
        WIDTH			= $container.width(),
        HEIGHT			= $container.height(),
        camera.aspect   = WIDTH/HEIGHT,
        renderer.setSize(WIDTH, HEIGHT);
        camera.updateProjectionMatrix();
    }
}
                       });
