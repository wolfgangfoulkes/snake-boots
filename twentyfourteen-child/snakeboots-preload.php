<?php
    /*
     Template Name: preload
     */
get_header("noimage");

$dir = get_stylesheet_directory_uri();
?>

<div class= "lightbox-grid clearfix">
    <div class="lightbox-cell">
        <div class="cell-content">
            <h3 class="cell-title"> the day I tryna live </h3>
        </div>
        <span data-type="glsl/vertex" data-name="tex" data-src="<?php echo $dir . "/shaders/texVert.glsl"?>"> </span>
        <span data-type="glsl/fragment" data-name="tex" data-src= "<?php echo $dir . "/shaders/texFrag.glsl"?>"> </span>
        <span class="javascript" data-name = "displayOBJ" data-src = "<?php echo $dir . "/js/canvas_preload.js" ?>"></span>
        <?php /*note that incorrect name/src pairing will still load if script with correct name is on page*/ ?>
    </div>

    <div class="lightbox-cell">
        <div class="cell-content">
            <h3 class="cell-title"> the day I tryna live </h3>
        </div>
        <span data-type="glsl/vertex" data-name="tex" data-src="<?php echo $dir . "/shaders/texVert.glsl"?>"> </span>
        <span data-type="glsl/fragment" data-name="tex" data-src= "<?php echo $dir . "/shaders/texFrag.glsl"?>"> </span>
        <span class="javascript" data-name = "displayOBJ2" data-src = "<?php echo $dir . "/js/canvas_preload2.js" ?>"></span>
    </div>

    <div class="lightbox-cell">
        <div class="cell-content">
            <h3 class="cell-title"> the day I tryna live </h3>
        </div>
        <span data-type="glsl/vertex" data-name="tex" data-src="<?php echo $dir . "/shaders/texVert.glsl"?>"> </span>
        <span data-type="glsl/fragment" data-name="tex" data-src= "<?php echo $dir . "/shaders/texFrag.glsl"?>"> </span>
        <span class="javascript" data-name = "displayOBJ" data-src = "<?php echo $dir . "/js/canvas_preload.js" ?>"></span>
    </div>

    <div class="lightbox-cell">
        <div class="cell-content">
            <h3 class="cell-title"> the day I tryna live </h3>
        </div>
        <span data-type="glsl/vertex" data-name="tex" data-src="<?php echo $dir . "/shaders/texVert.glsl"?>"> </span>
        <span data-type="glsl/fragment" data-name="tex" data-src= "<?php echo $dir . "/shaders/texFrag.glsl"?>"> </span>
        <span class="javascript" data-name = "displayOBJ2" data-src = "<?php echo $dir . "/js/canvas_preload2.js" ?>"></span>
    </div>
</div>

<div class="lb_canvas">
</div>
<div class= "gui-window">
</div>

<?php
get_sidebar();
get_footer();