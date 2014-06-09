var GALLERY = GALLERY || {};
GALLERY.scripts = {};
GALLERY.scripts["canvas2.js"] = {};
GALLERY.scripts["canvas2.js"].active = false;
GALLERY.localpath = "http://snake-boots.com/wp-content/themes/twentyfourteen-child";

/*Jquery time*/
jQuery(document).ready(function($){
	var lb_l, lb_r;
	//Flag for preventing multiple image displays
	var doc = $(document);
        
    function createWindow(callback)
    {
            var title = $item.find(".cell-title").html();
            
            //Remove active class from previously clicked LI
            $(".lightbox-cell .active").removeClass("active");
            //Mark the clicked LI as active for later use
            $item.addClass("active");
            
            //Adding additional HTML - only if it hasn't been added before
            if($(".lb_backdrop").length < 1)
            {
                var lb_backdrop = '<div class="lb_backdrop"></div>';
                var lb_title = '<span class="lb_title"></span>';
                var total_html = lb_backdrop+lb_title;
                
                $(total_html).appendTo("body");
            }
            //Fade in backdrop
            if($(".lb_backdrop:visible").length == 0)
            {
                $(".lb_backdrop").fadeIn("slow");
            }
            
            
            lb_l = $(".lb_canvas").css("left");
            lb_r = $(".lb_canvas").css("right");
            $(".lb_canvas").css({left: "50vw", right: "50vw", visibility: "visible"});
                
            //Animating .lb_canvas-inner to new dimentions and position
            $(".lb_canvas").animate({left: lb_l, right: lb_r}, 800, function(){
                $(".lb_title").html(title);

            });
            
            callback();
    }

    function loadScripts()
    {
        $scripts = $item.find(".javascript");
        var first = $scripts.first();
        index = 0;
        console.log("index: ", index);
        loadScript(first, function(){ console.log("all scripts loaded")} );
    }

    function loadScript(script, callback) //only calls callback on success
    {
        var q_index = index; //index from queue, not from success.
        index++;
        
        var url = script.data("src");
        jQuery.getScript(url)
        .done(function(contents, status, jqXHR){
            console.log("loaded script ", q_index, " with status: ", status); //, " and contents: ", contents);
            if (script.next().length == 0) {
                console.log("end of array: ", q_index);
                callback();
                return;
            }
            else {
                loadScript(script.next());
            }
        })
        .fail(function(jqXHR, settings, exception){
            console.log("failed to load script ", q_index, " with exception: ", exception);
            GALLERY.scripts["canvas2.js"].active = false;
        });
    }

    function lb_exit() {
        $(".lightbox-cell .active").removeClass("active");
        //Fade out the lightbox elements
        $(".lb_canvas").animate({left: "50vw", right: "50vw"}, function(){ //shrink canvas
            $(".lb_canvas").css({left: lb_l, right: lb_r, visibility: "hidden"}); //set css to initial.
            $(".lb_backdrop").fadeOut("slow", function(){ //THEN fade backdrop (fade automatically sets "display: none")
                //empty title
                $(".lb_title").html("");
                
                GALLERY.scripts["canvas2.js"].active = false;
                });
            
        });

    }
    
    $(".lightbox-grid .lightbox-cell").click(function() {
        $item = $(this);
        var index = 0;
        createWindow(loadScripts);
    
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
});