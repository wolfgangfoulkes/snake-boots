/* for getting localized PHP values, and managing other parameters shared between several files */

GLOBAL = GLOBAL || {};

GLOBAL.data = sb_local;
GLOBAL.dir = sb_local.dir;
//GLOBAL.scripts = {};
GLOBAL.images = {};
GLOBAL.objects = {};
GLOBAL.shaders = {};
//GLOBAL.gui //if we have multiple scripts using the same GUI
GLOBAL.imagesLoaded = false;
GLOBAL.objectsLoaded = false;

GLOBAL.loadImages = function(callback)
{
    GLOBAL.imageLength = Object.keys(sb_local.imagesURI).length;
    var loaded = GLOBAL.imageLength;
    console.log("number of images", GLOBAL.imageLength);
    
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
                console.log(loaded, "more to go!");
                GLOBAL.images[key] = image;
                loaded--;
                if (!loaded)
                {
                    callback();
                }
            }
        );

    
    }
};


/*
GLOBAL.loadObjects = function(callback)
{
    $.each(sb_local.objectsURI function ()
    {
        //AJAX / THREE object
    });
};

GLOBAL.loadShaders = function(callback){}
*/

/*GLOBAL.init(){
we might want to use a 
$.when 
here, then initialize the other scripts when images, objects, and shaders are done.
faster, less choppy.
could initialize container here (events would still be triggered I think), but right now, irrelevent.
}
*/

jQuery(document).ready(function($) {
    loadImages();
}