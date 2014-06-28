//IDEA: google switch manages display of each map.

var GLOBAL = GLOBAL || {};

jQuery(document).ready(function($) {
    var
    initTime = new Date().getTime(),
    $container,
    
    width,
    height,
    mouse,
    
    scene,
    sceneD,
    sceneN,
    
    textureD,
    textureN,
    textureNMap,
    textureOBJ,
    
    camera,
    cameraO,
    
    renderer,
    projector,
    
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
    IMG0Loaded = false,
    IMG1Loaded = false,
    localpath = "/Users/wolfgag/snake-boots/rtt";
    
    var active = false;
    
    /*****GUI
    */
    var gui_par = function ()
    {
        this.opacity = 1.0;
        this.color = [255.0, 255.0, 255.0];
        this.ambient = 1.0;
        this.diffuse = 1.0;
        this.specular = 1.0;
        this.shininess = 1.0;
        this.amplitudeD = 0.1;
        this.amplitudeN = 8.0;
        this.octaves = 3;
        this.lacunarity = 2.0;
        this.rate = 0.001; //coefficient for time
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
            if(!renderer) { return; }
            width			= $container.width();
            height			= $container.height();
            camera.aspect 	= width / height,
            renderer.setSize(width, height);

            camera.updateProjectionMatrix();
            console.log("width:", width,"height", height)
        },
        
        mousePos: function() {
            if (!active) { return; }
            
            var vector = new THREE.Vector3( ( event.clientX / $container.width() ) * 2.0 - 1.0, -( event.clientY / $container.height() ) * 2.0 + 1.0, 100 ); //0-1 into -1-1
            //0.0 would be 0.5 if we wanted to do below

            projector.unprojectVector( vector, camera );
            
            var dir = vector.clone().sub( camera.position );
            offset = dir.clone().multiplyScalar(-100000.0);
            mouse = camera.position.clone().add(offset);

            //var distance = - camera.position.z / dir.z;

            //var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
            //The variable pos is the position of the point in 3D space, "under the mouse", and in the plane z=0. I don't need that, doe.
        },
        mouseClick: function() {
            if (!active) { return; }
            
            console.log("offset", offset);
            console.log("camera", camera.position);
            console.log("mouse", mouse);

        }
    };

    function initGUI()
    {
        console.log("initGUI");
        var gui = new dat.GUI({autoPlace: false});
        var $gui	= $("#gui-container");
        
        gui.addColor(GUI, "color");
        gui.add(GUI, "opacity").min(0.0).max(1.0).step(0.01);
        gui.add(GUI, "ambient").min(0.0).max(1.0);
        gui.add(GUI, "diffuse").min(0.0).max(1.0);
        gui.add(GUI, "specular").min(0.0).max(1.0);
        gui.add(GUI, "shininess").min(1.0).max(8.0);
        gui.add(GUI, "rate").min(0.0001).max(0.001).step(0.0001);
        gui.add(GUI, "amplitudeN").min(1.0).max(256.0).step(8.0);
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
        $(window).mousemove(callbacks.mousePos);
        $(window).click(callbacks.mouseClick);
        
        projector = new THREE.Projector();
        
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
        
        mouse = new THREE.Vector3(0.0, 0.0, 0.0);

        // Create a light, set its position, and add it to the scene.
        var light = new THREE.PointLight(0xffffff);
        light.position.set(-1000,10,0);
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
            IMG0Loaded = true;
            if (initObject()) { checkRender(); } //fails if IMG and OBJ aren't uploaded
            }
        );
        loaderIMG.load(localpath + "/images/normal_pillow.png", function(image) {
            textureNMap = new THREE.Texture(image);
            textureNMap.needsUpdate = true;
            IMG1Loaded = true;
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
            mTime: { type: "f", value: runTime * GUI.rate },
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
            mAmplitudeN: { type: "f", value: GUI.amplitudeN }
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
        if ( !(OBJLoaded && IMG0Loaded && IMG1Loaded) ) { return false; }
        
        // set up uniforms for shader
        // UniformsLib is here https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/UniformsLib.js
        uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            {
                
                mTextureD: { type: "t", value: null },
                mTextureN: { type: "t", value: null },
                mTexture: { type: "t", value: null },
                
                uLightPosition: { type: "v3", value: mouse }, //could do light.position, but the shader don't use the light anyway
                
                mAmplitudeD: { type: "f", value: GUI.amplitudeD },
                mColor: { type: "v3", value: new THREE.Vector3(GUI.color[0], GUI.color[1], GUI.color[2]) },
                mAlpha: { type: "f", value: GUI.opacity },
                mAmbient: { type: "f", value: GUI.ambient },
                mDiffuse: { type: "f", value: GUI.diffuse },
                mSpecular: { type: "f", value: GUI.specular },
                mShininess: { type: "f", value: GUI.shininess }
            }
        ]);
        
        // THREE.UniformsUtils.merge() call THREE.clone() on each
        // uniform. We don't want our textures to be duplicated, so:
        uniforms.mTextureD.value = textureD;
        uniforms.mTextureN.value = textureN;
        uniforms.mTexture.value = textureOBJ;
    
        material = new THREE.ShaderMaterial({
                                                    uniforms: uniforms,
                                                    vertexShader: shaders.bumpPhong.vertex,
                                                    fragmentShader: shaders.bumpPhong.fragment,
                                                    //blending: THREE.AdditiveBlending,
                                                    transparent: true,
                                                    lights: true,
                                                    depthTest: false
                                                });
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) { //complex model has many children
                child.geometry.computeTangents(); //necessary for shader
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
        uniforms.uLightPosition.value = mouse;
        
        uniforms.mAmbient.value = GUI.ambient;
        uniforms.mDiffuse.value = GUI.diffuse;
        uniforms.mSpecular.value = GUI.specular;
        uniforms.mShininess.value = GUI.shininess;
        
        uniforms.needsUpdate = true;
        
        //displacement map
        uniformsD.mOctaves.value = GUI.octaves;
        uniformsD.mLacunarity.value = GUI.lacunarity;
        uniformsD.mTime.value = runTime * GUI.rate;
        uniformsD.needsUpdate = true;
        
        //normal map
        uniformsN.mAmplitudeN.value = GUI.amplitudeN;
        uniformsN.needsUpdate = true;
    }
     
    function checkInitScene()   {
        if (shaderCount) { return; }
        initScene();
     }
     
    function checkRender() {
        if ( !(object && renderer && scene) ) { return; }
        active = true;
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

