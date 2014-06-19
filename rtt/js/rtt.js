var GLOBAL = GLOBAL || {};

jQuery(document).ready(function($) {
    var
    $container,
    
    width,
    height,
    
    scene,
    sceneD,
    sceneN,
    
    textureD,
    textureN,
    textureOBJ,
    
    camera,
    cameraO,
    
    renderer,
    
    object,
    quadN,
    quadD,
    
    uniforms,
    uniformsD,
    uniformsN,
    
    material,
    materialD,
    materialN,
    
    shaderCount,
    shaders = {},

    OBJLoaded = false,
    IMGLoaded = false,
    localpath = "/Users/wolfgag/snake-boots/rtt";

    /*****GUI
    */
    var gui_par = function ()
    {
        this.list = 0;
        this.opacity = 1.0;
        this.color = [255.0, 255.0, 255.0];
        this.amplitude = 4.0;
    }
    var GUI = new gui_par();
    

    /*****CALLBACKS
    * Our internal callbacks object - a neat
    * and tidy way to organise the various
    * callbacks in operation.
    */
    callbacks =
    {
        windowResize: function() {
            if(renderer) {
                width			= $container.width();
                height			= $container.height();
                camera.aspect 	= width / height,
                renderer.setSize(width, height);

                camera.updateProjectionMatrix();
                console.log("width:", width,"height", height)
            }
        }
    };

    function initGUI()
    {
        console.log("initGUI");
        var gui = new dat.GUI({autoPlace: false});
        var $gui	= $("#gui-container");
        
        gui.add(GUI, "list").name("whatev").options({
                                                                    "off": 0,
                                                                    "on": 1
                                                                    }); //.onChange(changeColor)
        gui.addColor(GUI, "color");
        gui.add(GUI, "opacity").min(0.0).max(1.0);
        gui.add(GUI, "amplitude").min(1.0/16.0).max(16.0);
        //can save data too. lookintoit.
        $gui.append(gui.domElement);
    }


    // Sets up the scene.
    function initScene()
    {
        // Create the scene and set the scene size.
        $container = $("#container");
        width = $container.width();
        height = $container.height();
        
        scene = new THREE.Scene();
        sceneD = new THREE.Scene();
        sceneN = new THREE.Scene();
        
        textureD = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );
        textureN = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );

        // Create a renderer and add it to the DOM.
        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(width, height);
        renderer.autoClear = false;
        renderer.context.getExtension('OES_standard_derivatives');
        //var gl = renderer.domElement.getContext('webgl') || renderer.domElement.getContext('experimental-webgl');
        //gl.getExtension('OES_standard_derivatives');
        $container.append(renderer.domElement);
     
        //add custom callback to window.resize
        $(window).resize(callbacks.windowResize);

        // Create a camera, zoom it out from the model a bit, and add it to the scene.
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
        camera.position.set(0,0,100);
        //scene.add(camera);
        
        cameraO = new THREE.OrthographicCamera( width * -.5, width * .5, height * .5, height * -.5, -10000, 10000 );
		cameraO.position.z = 100;
        scene.add(cameraO);
        sceneN.add(cameraO);
        sceneD.add(cameraO);

        // Set the background color of the scene.
        renderer.setClearColor(new THREE.Color(0xFF0000));

        // Create a light, set its position, and add it to the scene.
        var light = new THREE.PointLight(0xffffff);
        light.position.set(-100,200,100);
        scene.add(light);
        
        var lightN = new THREE.DirectionalLight( 0xffffff );
        lightN.position.set( 0, 0, 1.0 ).normalize();
        sceneN.add( lightN );

        lightN = new THREE.DirectionalLight( 0xffaaaa, 1.5 );
        lightN.position.set( 0, 0, -1.0 ).normalize();
        sceneN.add( lightN );

        // Add OrbitControls so that we can pan around with the mouse.
        controls = new THREE.OrbitControls(camera, renderer.domElement);
     
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
     
        var loaderIMG = new THREE.ImageLoader(manager);
        loaderIMG.load(localpath + "/images/Blackened-Chicken-Pre-Cooked.jpg", function(image) {
            textureOBJ = new THREE.Texture(image);
            textureOBJ.needsUpdate = true;
            initNMap();
            renderNMap();
            IMGLoaded = true;
            if (initObject()) { checkRender(); } //fails if IMG and OBJ aren't uploaded
            }
        );
     
        var loaderOBJ = new THREE.OBJLoader(manager);
        loaderOBJ.load(localpath + "/models/plane.obj", function(obj) {
            object = obj;
            OBJLoaded = true;
            if (initObject()) { checkRender(); } //fails if IMG and OBJ aren't uploaded
            }
        );
    }
     
     function loadShaders()
     {
        // get all the shaders from the DOM
        var fragmentShaders = $("span[data-type='glsl/fragment']");
        var vertexShaders	= $("span[data-type='glsl/vertex']");
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
    
    function initDMap() {
        uniformsD = {
        };
        
        materialD = new THREE.ShaderMaterial({
                                                    uniforms: uniformsD,
                                                    vertexShader: shaders.mapD.vertex,
                                                    fragmentShader: shaders.mapD.fragment,
                                                    transparent: true
                                                });
        
        var plane = new THREE.PlaneGeometry( width, height );
        quadD = new THREE.Mesh( plane, materialD );
        quadD.position.z = -100;
        sceneD.add( quadD );
    }
    
    function initNMap() {
        uniformsN = {
            mTexture: { type: "t", value: textureOBJ },
            mAmplitude: { type: "f", value: GUI.amplitude }
        };
        
        materialN = new THREE.ShaderMaterial({
                                                    uniforms: uniformsN,
                                                    vertexShader: shaders.mapN.vertex,
                                                    fragmentShader: shaders.mapN.fragment
                                                });
        
        var plane = new THREE.PlaneGeometry( width, height );
        quadN = new THREE.Mesh( plane, materialN );
        quadN.position.z = -100;
        sceneN.add( quadN );
    }
    
    
     
    function initObject() {
        if ( !(OBJLoaded && IMGLoaded) ) { return false; }
        
        // set up uniforms for shader
        uniforms = {
            mColor: { type: "v3", value: new THREE.Vector3(GUI.color[0], GUI.color[1], GUI.color[2]) },
            mTextureD: { type: "t", value: new THREE.Texture() },
            mTextureN: { type: "t", value: new THREE.Texture() },
            mTexture: { type: "t", value: textureN },
            mAlpha: { type: "f", value: GUI.opacity }
        };

        material = new THREE.ShaderMaterial({
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
        
        object.scale.set(100.0, 100.0, 100.0);
        object.dynamic=true;

        scene.add(object);

        return true;
    }
    
    function renderDMap() {
        renderer.render( sceneD, cameraO, textureD, true );
    }
    
    function renderNMap() {
        renderer.render( sceneN, cameraO, textureN, true );
    }
    
     // Renders the scene and updates the render as needed.
    function render() {
        // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestAnimationFrame(render);

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
        //console.log( GUI.color[0] * (1.0 / 255.0), GUI.color[1] * (1.0 / 255.0), GUI.color[2] * (1.0 / 255.0) );
        
        uniformsN.mAmplitude.value = GUI.amplitude;
        uniformsN.needsUpdate = true;
    }
     
    function checkInitScene()   {
        if (shaderCount) { return; }
        initScene();
     }
     
    function checkRender() {
        if ( !(object && renderer && scene) ) { return; }
        render();
     }

    this.init = function(){
        initGUI();
        loadShaders();
    };

     
    /* for updating vertices
    // set the geometry to dynamic
    // so that it allow updates
    sphere.geometry.dynamic = true;

    // changes to the vertices
    sphere.geometry.verticesNeedUpdate = true;

    // changes to the normals
    sphere.geometry.normalsNeedUpdate = true;
    */
    
    this.init();
});

