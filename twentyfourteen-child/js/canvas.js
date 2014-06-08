jQuery(document).ready(function($) {
// Set up the scene, camera, and renderer as global variables.
//doesn't change anything if these are globals
var
$container,
scene,
camera,
renderer,
object,
texture,
shaderCount,
shaders = {},

OBJLoaded = false,
IMGLoaded = false,
localpath = canvas_vars.path;

/*****GUI
*/
var gui_par = function ()
{
    this.list = 0;
    this.opacity = 1.0;
    this.color = [255.0, 255.0, 255.0];
}
var GUI = new gui_par();

var uniforms;

/*****CALLBACKS
* Our internal callbacks object - a neat
* and tidy way to organise the various
* callbacks in operation.
*/
callbacks =
{
    windowResize: function() {
        if(renderer) {
            var width			= $container.width();
            var height			= $container.height();
            camera.aspect 	= width / height,
            renderer.setSize(width, height);

            camera.updateProjectionMatrix();
            console.log("width:", width,"height", height)
        }
    }
};

init();

function initGUI()
{
    console.log("called");
    var gui = new dat.GUI({autoPlace: false});
    var $gui	= $("#gui-window");
    /*
    $msg		= $('#msg')
 
    //$gui.find("guidat").prepend($msg);
 
    msg.css({
        display: block; //this'd be for an object set with "display: none"
        })
    */
    gui.add(GUI, "list").name("whatev").options({
                                                                "off": 0,
                                                                "on": 1
                                                                }); //.onChange(changeColor)
    gui.addColor(GUI, "color");
    gui.add(GUI, "opacity").min(0.0).max(1.0);
    //can save data too. lookintoit.
    $gui.append(gui.domElement);
}


// Sets up the scene.
function initScene()
{
    // Create the scene and set the scene size.
    $container = $("#container"),
    scene = new THREE.Scene();
    var width = $container.width();
    var height = $container.height();

    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(width, height);
    $container.append(renderer.domElement);
 
    //add custom callback to window.resize
    $(window).resize(callbacks.windowResize);

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
    camera.position.set(0,0,100);
    scene.add(camera);

    // Set the background color of the scene.
    renderer.setClearColor(new THREE.Color(0xFF0000));

    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);

    // Add OrbitControls so that we can pan around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);
 
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };
 
    var loaderIMG = new THREE.ImageLoader(manager);
    loaderIMG.load(localpath + "/images/UV_Grid_Sm", function(image) {
        texture = new THREE.Texture(image);
        texture.needsUpdate = true;
        IMGLoaded = true;
        if (initObject()) { checkAnimate(); } //fails if IMG and OBJ aren't uploaded
        }
    );
 
    var loaderOBJ = new THREE.OBJLoader(manager);
    loaderOBJ.load(localpath + "/models/male02.obj", function(obj) {
        object = obj;
        OBJLoaded = true;
        if (initObject()) { checkAnimate(); } //fails if IMG and OBJ aren't uploaded
        }
    );
}
 
 function loadShaders()
 {
    // get all the shaders from the DOM
    var fragmentShaders = $("script[type='glsl/fragment']");
    var vertexShaders	= $("script[type='glsl/vertex']");
    shaderCount		= fragmentShaders.length + vertexShaders.length;
    console.log("fragment shaders:", fragmentShaders.length);
    console.log("vertex shaders:", vertexShaders.length);
 
    // load the fragment shaders
    for(var f = 0; f < fragmentShaders.length; f++) {
        var fShader = fragmentShaders[f];
        loadShader(fShader, "fragment"); //pass urls from array of script objects to AJAX
    }
 
    // and the vertex shaders
    for(var v = 0; v < vertexShaders.length; v++) {
        var vShader = vertexShaders[v];
        loadShader(vShader, "vertex"); //pass urls from array of script objects to AJAX
    }
 
    checkInitScene(); //in the case there were no shaders.
 }
 
 function loadShader(shader, type) {
 
     // wrap up the shader for convenience
     var $shader = $(shader);
     
     console.log($shader.data("src"), $shader.data("name"), type);
     // request the file over AJAX
     $.ajax({
            url: $shader.data("src"), //passed in with an arbitary attribute "data-src="
            dataType: "text",
            context: { //context is the value of "this" for the callback. so we create a new object to represent the shader
                name: $shader.data("name"), //passed in with arbitrary attribute "data-name="
                type: type
                },
            complete: processShader
            });
 }
 
 function processShader(jqXHR, textStatus){ //callback for AJAX
 
    // one down... some to go?
    shaderCount--;
 
    // create a placeholder if needed
    if(!shaders[this.name]) {
        shaders[this.name] =
        {
            vertex: "",
            fragment: ""
        };
    }
 
    // store it and check if we're done
    shaders[this.name][this.type] = jqXHR.responseText;
    console.log("shader:", this.name, this.type, jqXHR.responseText);
    checkInitScene();
 }
 
    function initObject() {
    if ( !(OBJLoaded && IMGLoaded) ) { return false; }
    
    // set up uniforms for shader
    uniforms = {
        mColor: { type: "v3", value: new THREE.Vector3(GUI.color[0], GUI.color[1], GUI.color[2]) },
        mTexture: { type: "t", value: texture },
        mAlpha: { type: "f", value: GUI.opacity }
    };

    var material = new THREE.ShaderMaterial({
                                                uniforms: uniforms,
                                                vertexShader: shaders.tex.vertex,
                                                fragmentShader: shaders.tex.fragment,
                                                transparent: true
                                            });
     
    object.traverse(function (child) {
        if (child instanceof THREE.Mesh) { //complex model has many children
            child.material = material;
        }
    });

    scene.add(object);

    return true;
    }
 
 // Renders the scene and updates the render as needed.
function animate() {
    // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame(animate);

    // Render the scene
    renderer.render(scene, camera);
    controls.update();
    updateUniforms();
}

function updateUniforms()
{
    uniforms.mColor.value.x = GUI.color[0] * (1.0 / 255.0); //don't divide by zero, baby
    uniforms.mColor.value.y = GUI.color[1] * (1.0 / 255.0);
    uniforms.mColor.value.z = GUI.color[2] * (1.0 / 255.0);
    uniforms.mAlpha.value = GUI.opacity;
    
    uniforms.mColor.needsUpdate = true;
    uniforms.mAlpha.needsUpdate = true;
    console.log( GUI.color[0] * (1.0 / 255.0), GUI.color[1] * (1.0 / 255.0), GUI.color[2] * (1.0 / 255.0) );
}
 
function checkInitScene()   {
    if (shaderCount) { return; }
    initScene();
 }
 
function checkAnimate() {
    if ( !(object && renderer && scene) ) { return; }
    animate();
 }

function init() {
    initGUI();
    loadShaders();
}

 
/* for updating vertices
// set the geometry to dynamic
// so that it allow updates
sphere.geometry.dynamic = true;

// changes to the vertices
sphere.geometry.verticesNeedUpdate = true;

// changes to the normals
sphere.geometry.normalsNeedUpdate = true;
*/

});