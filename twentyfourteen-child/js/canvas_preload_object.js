/*GLOBAL SCOPE*/

jQuery(document).ready(function($) { //enclosure, might be easier to use the no-conflict method
/*PRIVATE TO DOCUMENT*/

    /* right now, this function as a member of GALLERY is a namespace-more-trouble-than-it's-worth. however, if you set up a param in the lightbox file that
    checked if these were defined (on getting the name) BEFORE loading them from AJAX and CALLED them if they were already loaded it would make shit WAY faster.
    then you wouldn't need the name param: instead you would have either an ACTIVE param set by gallery, or an EXIT function to call (that would also take care of "deallocation") 
    also, checking the shaders by name would be similarly helpful */

    
    GALLERY.scripts.displayOBJ = new function() {
    /*PUBLIC SCOPE IN FUNCTION*/
        var name = "displayOBJ",
        shaders = GALLERY.shaders || {},
        localpath = GALLERY.dir,
        
        $container,
        scene,
        camera,
        renderer,
        object,
        texture,

        //window size
        width,
        height,
        
        uniforms;

        /*****GUI
        */
        var gui_par = function()
        {
            this.list = 0;
            this.opacity = 1.0;
            this.color = [255.0, 255.0, 255.0];
        };
        var GUI = new gui_par();

        this.loaded = false;
        this.active = false;

        /*****CALLBACKS
        * Our internal callbacks object - a neat
        * and tidy way to organise the various
        * callbacks in operation.
        */
        callbacks =
        {
            windowResize: function() {
                if(renderer) {
                    width			= $container.outerWidth();
                    height			= $container.outerHeight();
                    camera.aspect 	= width / height,
                    renderer.setSize(width, height);

                    camera.updateProjectionMatrix();
                    console.log("resize width:", width,"resize height", height);
                }
            }
        };
        
        this.init = function() { //storing function as property so it can be called externally
            if (!(this.loaded)) { console.log(name, " is not loaded yet", this.loaded); return; }
            GALLERY.scripts[name].active = true;
            
            initGUI(function(){
                console.log("initialized GUI");
                initScene(function() {
                    console.log("initialized scene");
                    initObject(function(){
                        console.log("initialized object");
                        checkAnimate();
                        });
                    });
                });
        };

        function initGUI(callback)
        {
            console.log("initGUI");
            var gui = new dat.GUI({autoPlace: false});
            var $gui	= $("#gui-window");

            gui.add(GUI, "list").name("whatev").options({
                                                            "off": 0,
                                                            "on": 1
                                                            }); //.onChange(changeColor)
            gui.addColor(GUI, "color");
            gui.add(GUI, "opacity").min(0.0).max(1.0);
            //can save data too. lookintoit.
            $gui.append(gui.domElement);
            callback();
        }


        // Sets up the scene.
        function initScene(callback) {
            // Create the scene and set the scene size.
            $container = $("#container");
            scene = new THREE.Scene();
            width = GALLERY.canvas.initWidth;
            height = GALLERY.canvas.initHeight;

            // Create a renderer and add it to the DOM.
            renderer = new THREE.WebGLRenderer({antialias:true});
            renderer.setSize(width, height);
            console.log("init width: ", width, "init height: ", height);
            $container.append(renderer.domElement);
         
            //add custom callback to window.resize
            $(window).resize(callbacks.windowResize);

            // Create a camera, zoom it out from the model a bit, and add it to the scene.
            camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
            camera.position.set(0,0,100);
            scene.add(camera);

            // Set the background color of the scene.
            renderer.setClearColor(new THREE.Color(0x002666));

            // Create a light, set its position, and add it to the scene.
            var light = new THREE.PointLight(0x172305);
            light.position.set(-100,200,100);
            scene.add(light);

            // Add OrbitControls so that we can pan around with the mouse.
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            callback();
        }
        
        function loadOBJ(callback) {
            var manager = new THREE.LoadingManager();
            manager.onProgress = function ( item, loaded, total ) {
                console.log( item, loaded, total );
            };
         
            var loaderOBJ = new THREE.OBJLoader(manager);
            loaderOBJ.load(localpath + "/models/male02.obj", function(obj) {
                    object = obj;
                    callback();
                    });
        }
         
        function initObject(callback) {
            texture = new THREE.Texture(GALLERY.images["uv_grid"]);
            texture.needsUpdate = true;
            
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
            callback();
        }
         
         // Renders the scene and updates the render as needed.
        function animate() {
            if (!GALLERY.scripts[name].active)
            {
                console.log("exiting script: ", name);
                return;
            }
            console.log("continuing with animation why the fuck not");

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
            //console.log( GUI.color[0] * (1.0 / 255.0), GUI.color[1] * (1.0 / 255.0), GUI.color[2] * (1.0 / 255.0) );
        }
         
         
        function checkAnimate() { //could be replaced with a promise object in the future.
            if ( !(object && renderer && scene) ) { return; }
            animate();
         }

        function exit() {
            //could use a function to clean up.
            //would need to create more objects (e.g. "inner" objects)
        }
        
        //initialization for the function object.
            loadOBJ(function(){
                console.log("loaded object");
                GALLERY.scripts.displayOBJ.loaded = true; //"this" didn't work
            });
    };
});

