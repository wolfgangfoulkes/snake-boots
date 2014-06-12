/* for getting localized PHP values, and managing other parameters shared between several files */

GLOBAL = GLOBAL || {};

GLOBAL.data = sb_local;
GLOBAL.dir = sb_local.dir;
GLOBAL.images = {};
GLOBAL.objects = {};
GLOBAL.shaders = {};
//GLOBAL.gui //if we have multiple scripts using the same GUI
GLOBAL.imagesLoaded = false;
GLOBAL.objectsLoaded = false;

GLOBAL.loadImages = function(callback)
{
    //should use a for loop, should find some way to feed index in before loading, so they happen in the right order, ajax won't do it for ya easy, but THREE will, same applies below.
};

GLOBAL.loadObjects = function(callback)
{
    $.each(sb_local.objectsURI function ()
    {
        //AJAX / THREE object
    });
};

GLOBAL.loadShaders = function(callback){}

/*GLOBAL.init(){
we might want to use a 
$.when 
here, then initialize the other scripts when images, objects, and shaders are done.
faster, less choppy.
could initialize container here (events would still be triggered I think), but right now, irrelevent.
}