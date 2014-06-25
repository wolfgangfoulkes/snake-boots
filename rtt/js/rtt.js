//IDEA: google switch manages display of each map.

var GLOBAL = GLOBAL || {};

jQuery(document).ready(function($) {
    var
    initTime = new Date().getTime(),
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
        this.opacity = 1.0;
        this.color = [255.0, 255.0, 255.0];
        this.amplitudeD = 0.1;
        this.amplitudeN = 100.0;
        this.octaves = 3;
        this.lacunarity = 2.0;
        this.rate; //coefficient for time
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
        
        gui.addColor(GUI, "color");
        gui.add(GUI, "opacity").min(0.0).max(1.0).step(0.01);
        gui.add(GUI, "amplitudeN").min(1.0).max(200.0);
        gui.add(GUI, "amplitudeD").min(0.0).max(0.5).step(0.01); //best range is 0-1, but I leave this to test the normal-map.
        gui.add(GUI, "octaves").min(1).max(8).step(1);
        gui.add(GUI, "lacunarity").min(1.0).max(16.0);
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
        
        
        // Create a renderer and add it to the DOM.
        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(width, height);
        //renderer.autoClear = false; //removes "clear-color"
        /**FOLLOWING is necessary for using functions like dFdx() in a shader, but it must be matched with code in the shader: */
        renderer.context.getExtension('OES_standard_derivatives');
        /**an alternative to ABOVE:
        var gl = renderer.domElement.getContext('webgl') || renderer.domElement.getContext('experimental-webgl');
        gl.getExtension('OES_standard_derivatives');
        */
        $container.append(renderer.domElement);
        
        //add custom callback to window.resize
        $(window).resize(callbacks.windowResize);
        
        //initialize three scenes
        scene = new THREE.Scene();
        sceneD = new THREE.Scene();
        sceneN = new THREE.Scene();
        
        //initialize FBO textures
        textureD = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );
        textureN = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );

        // Create a camera, zoom it out from the model a bit, and add it to the scene.
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
        camera.position.set(0,0,100);
        scene.add(camera);
        
        //create an orthographic camera for rendering to texture
        cameraO = new THREE.OrthographicCamera( width * -.5, width * .5, height * .5, height * -.5, -10000, 10000 );
		cameraO.position.z = 100;
        sceneN.add(cameraO);
        sceneD.add(cameraO);


        // Create a light, set its position, and add it to the scene.
        var light = new THREE.PointLight(0xffffff);
        light.position.set(-100,200,100);
        scene.add(light);

        // Add OrbitControls so that we can pan around with the mouse.
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        
        initDMap();
        initNMap();
        
        loadResources();
    }
    
    function loadResources() //maybe do this after shaders, then init scene.
    {
        var manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
     
        var loaderIMG = new THREE.ImageLoader(manager);
        loaderIMG.load(localpath + "/images/Blackened-Chicken-Pre-Cooked.jpg", function(image) {
            textureOBJ = new THREE.Texture(image);
            textureOBJ.needsUpdate = true;
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
        var curTime = new Date();
        var runTime = (curTime.getTime() - initTime);
    
        uniformsD = {
            mTime: { type: "f", value: runTime * 0.001 },
            mLacunarity: { type: "f", value: GUI.lacunarity },
            mOctaves: { type: "i", value: GUI.octaves }
        };
        
        materialD = new THREE.ShaderMaterial({
                                                    uniforms: uniformsD,
                                                    vertexShader: shaders.mapD.vertex,
                                                    fragmentShader: shaders.mapD.fragment,
                                                });
        
        var plane = new THREE.PlaneGeometry( width, height );
        quadD = new THREE.Mesh( plane, materialD );
        quadD.position.z = -100;
        sceneD.add( quadD );
    }
    
    function initNMap() {
        uniformsN = {
            mTexture: { type: "t", value: textureD },
            mAmplitudeN: { type: "f", value: 8.0 },
            mAmplitudeD: { type: "f", value: GUI.amplitudeN }
        };
        
        materialN = new THREE.ShaderMaterial({
                                                    uniforms: uniformsN,
                                                    vertexShader: shaders.mapN.vertex,
                                                    fragmentShader: shaders.mapN.fragment,
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
            mTextureD: { type: "t", value: textureD },
            mTextureN: { type: "t", value: textureN },
            mTexture: { type: "t", value: textureOBJ },
            mAmplitudeD: { type: "f", value: GUI.amplitudeD },
            mAlpha: { type: "f", value: GUI.opacity }
        };

        material = new THREE.ShaderMaterial({
                                                    uniforms: uniforms,
                                                    vertexShader: shaders.tex.vertex,
                                                    fragmentShader: shaders.tex.fragment,
                                                    blending: THREE.AdditiveBlending,
                                                    transparent: true,
                                                    depthTest: false
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
        renderer.render( sceneD, cameraO, textureD, true ); //last parameter force-clear the buffer, regardless of autoclear
    }
    
    function renderNMap() {
        renderer.render( sceneN, cameraO, textureN, true );
    }
    
     // Renders the scene and updates the render as needed.
    function render() {
        // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestAnimationFrame(render);

        // Render the scene
        renderNMap();
        renderDMap();
        renderer.setClearColor(new THREE.Color(0xFF0000));
        renderer.render(scene, camera);
        controls.update();
        updateUniforms();
    }

    function updateUniforms()
    {
        var curTime = new Date();
        var runTime = (curTime.getTime() - initTime);
    
        uniforms.mColor.value.x = GUI.color[0] * (1.0 / 255.0); //don't divide by zero, baby
        uniforms.mColor.value.y = GUI.color[1] * (1.0 / 255.0);
        uniforms.mColor.value.z = GUI.color[2] * (1.0 / 255.0);
        uniforms.mAlpha.value = GUI.opacity;
        uniforms.mAmplitudeD.value = GUI.amplitudeD;
        
        uniforms.needsUpdate = true;
        //console.log( GUI.color[0] * (1.0 / 255.0), GUI.color[1] * (1.0 / 255.0), GUI.color[2] * (1.0 / 255.0) );
        
        //displacement map
        uniformsD.mOctaves.value = GUI.octaves;
        uniformsD.mLacunarity.value = GUI.lacunarity;
        uniformsD.mTime.value = runTime * 0.001;
        uniformsD.needsUpdate = true;
        
        console.log(initTime, runTime * 0.001);
        
        //normal map
        uniformsN.mAmplitudeD.value = GUI.amplitudeN;
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

