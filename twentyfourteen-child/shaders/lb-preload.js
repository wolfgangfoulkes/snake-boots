var GALLERY = GALLERY || {};
GALLERY.data = sb_local;
GALLERY.dir = sb_local.dir;
GALLERY.scripts = {};
GALLERY.shaders = {};
GALLERY.localpath = "http://snake-boots.com/wp-content/themes/twentyfourteen-child";
GALLERY.canvas = {};
GALLERY.images = {};
GALLERY.IMGLoaded = false;
GALLERY.OBJLoaded = false;

/*Jquery time*/
jQuery(document).ready(function($){
	//Flag for preventing multiple image displays
	var doc = $(document);
    var $item;
    var title;
    
    GALLERY.canvas.left = $(".lb_canvas").css("left");
    GALLERY.canvas.right = $(".lb_canvas").css("right");
    GALLERY.canvas.bottom = $(".lb_canvas").css("bottom");
    GALLERY.canvas.top = $(".lb_canvas").css("top");
    GALLERY.canvas.initWidth = $(".lb_canvas").outerWidth();
    GALLERY.canvas.initHeight = $(".lb_canvas").outerHeight();
    console.log("initial size: ", GALLERY.canvas.initWidth, ", ", GALLERY.canvas.initHeight);
        
    function createWindow(callback) //callback is called before animation begins
    {
            //Adding additional HTML - only if it hasn't been added before
            if($(".lb_backdrop").length < 1)
            {
                var lb_backdrop = '<div class="lb_backdrop"></div>';
                var lb_title = '<span class="lb_title"></span>';
                var total_html = lb_backdrop+lb_title;
                
                $(total_html).appendTo("body");
            }
            
            //Remove active class from previously clicked LI
            $(".lightbox-cell .active").removeClass("active");
            //Mark the clicked LI as active for later use
            $item.addClass("active");
            
            //add temporary object to store renderer's DOM element
            var lb_canvas_inner = '<div id="container" class = "lb_canvas_inner"></div>';
            $(lb_canvas_inner).appendTo(".lb_canvas");
            
            var gui_inner = '<span id="gui-window" class = "gui_inner"></span>';
            $(gui_inner).appendTo(".gui-window");
            
            callback();
    }
    
    function animateWindow(callback)
    {
            //Fade in backdrop
            if($(".lb_backdrop:visible").length == 0)
            {
                $(".lb_backdrop").fadeIn("slow");
            }
            
            $(".lb_canvas").css({left: "50vw", right: "50vw", visibility: "visible"});
                
            //Animating .lb_canvas to new dimensions and position
            $(".lb_canvas").animate({left: GALLERY.canvas.left, right: GALLERY.canvas.right}, 800, function(){
                $(".lb_title").html(title);
                callback();
            });
    }
    
    function loadScripts(callback)
    {
        $scripts = $(document).find(".javascript");
        script_count = $scripts.length;
        $scripts.each(function(){
            loadScript($(this), function() {
            console.log("all scripts loaded!");
            callback();
            });
        });
    }
    
    function loadScript($script, callback)
    {
        var url = $script.data("src");
        var name = $script.data("name");
        console.log("script from DOM", url, name);
        
        if (!GALLERY.scripts[name]) {
            GALLERY.scripts[name] = {};
        }
        
        GALLERY.scripts[name].active = false;
        
        jQuery.getScript(url)
        .done(function(contents, status, jqXHR){
            script_count--;
            console.log("loaded script ", name, " with status: ", status, "and ", script_count, " more to go!"); // " and contents: ", contents);
            if (script_count == 0) {
                callback();
            }
        })
        .fail(function(jqXHR, settings, exception){
            console.log("failed to load script ", name, " with exception: ", exception);
            GALLERY.scripts[name].active = false;
        });
    }

    var loadShaders = function(callback) {
            var fragmentShaders = $(document).find('[data-type="glsl/fragment"]');
            var vertexShaders	= $(document).find('[data-type="glsl/vertex"]');
            var shaderCount		= fragmentShaders.length + vertexShaders.length;
            
            console.log("fragment shaders:", fragmentShaders.length);
            console.log("vertex shaders:", vertexShaders.length);
         
            // load the fragment shaders
            for(var f = 0; f < fragmentShaders.length; f++) {
                var fShader = fragmentShaders[f];
                loadShader(fShader, "fragment");
            }
         
            // and the vertex shaders
            for(var v = 0; v < vertexShaders.length; v++) {
                var vShader = vertexShaders[v];
                loadShader(vShader, "vertex");
            }
            
            if (!shaderCount) { callback(); } //if there are no shaders

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
                                //could've passed the callback here, made this more modular
                            },
                        complete: processShader
                        });
            }
            
            function processShader(jqXHR, textStatus) { //callback for AJAX
         
                // one down... some to go?
                shaderCount--;
             
                // create a placeholder if needed
                if(!GALLERY.shaders[this.name]) {
                    GALLERY.shaders[this.name] =
                    {
                        vertex: "",
                        fragment: ""
                    };
                }
             
                // store it and check if we're done
                GALLERY.shaders[this.name][this.type] = jqXHR.responseText;
                console.log("shader:", this.name, this.type);
                if (!shaderCount) { callback(); }
            }
    };
    
    function loadImages(callback) {
        GALLERY.imageLength = Object.keys(sb_local.imagesURI).length;
        var imgcount = GALLERY.imageLength;
        console.log("number of images", GALLERY.imageLength);
        
        $.each(sb_local.imagesURI, function (key, element){
            //in this callback "this" == the current element
            console.log("iterator key", key);
            console.log("iterator imageURI", element);
            
            var manager = new THREE.LoadingManager();
            manager.onProgress = function ( item, loaded, total ) {
                        console.log( item, loaded, total );
                    };
                 
            var loaderIMG = new THREE.ImageLoader(manager);
            loaderIMG.load(element, function(image) {
                    console.log("loaded key", key,  "!");
                    console.log(imgcount, "more to go!");
                    GALLERY.images[key] = image;
                    imgcount--;
                    if (!imgcount) {
                        callback();
                    }
                }); //loadImage
            }); //$.each
        } //loadImages

            

    function lb_exit() {
        $(".lightbox-cell .active").removeClass("active");
        //Fade out the lightbox elements
        $(".lb_canvas").animate({left: "50vw", right: "50vw"}, function(){ //shrink canvas
            $(".lb_canvas").css({left: GALLERY.canvas.left, right: GALLERY.canvas.right, visibility: "hidden"}); //set css to initial.
            $(".lb_backdrop").fadeOut("slow", function(){ //THEN fade backdrop (fade automatically sets "display: none")
                //empty title
                $(".lb_title").html("");
                
                for (var i in GALLERY.scripts) {i.active = false;}
                $(".lb_canvas_inner").detach();
                $(".gui_inner").detach();
                });
            
        });

    }
    
    $(".lightbox-grid .lightbox-cell").click(function() {
        $item = $(this);
        title = $item.find(".cell-title").html();
        var name = $item.find(".javascript").data("name");
        var script = GALLERY.scripts[name];
        if (typeof script == "undefined") {console.log("called script is not defined:", name); return; }
        else if (script.length == 0) {console.log("called script is not initialized:", name); return; }
        createWindow(function(){
            console.log("created Window");
            script.init();
            animateWindow(function(){
                console.log("window Animation complete");
            });
        });
    });
    
    //Click based navigation
	doc.on("click", ".lb_backdrop", function(){ lb_exit() });
	
	//Keyboard based navigation
	doc.keyup(function(e){
		//Keyboard navigation should work only if lightbox is active which means backdrop is visible.
		if($(".lb_backdrop:visible").length == 1)
		{
			if(e.keyCode == "27") lb_exit();
		}
	});
    
    
    loadShaders(function(){
        console.log("loaded Shaders");
        loadImages(function(){
            console.log("loaded Images");
            loadScripts(function(){
                    console.log("loaded Scripts");
            });
        });
    });
});