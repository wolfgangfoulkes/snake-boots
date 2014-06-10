<?php
    /*
     Template Name: Script Gallery
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
        <span class="javascript" data-name = "canvas2" data-src = "<?php echo $dir . "/js/canvas2.js" ?>"></span>
    </div>

    <div class="lightbox-cell">
        <div class="cell-content">
            <h3 class="cell-title"> the day I tryna live </h3>
        </div>
        <span data-type="glsl/vertex" data-name="tex" data-src="<?php echo $dir . "/shaders/texVert.glsl"?>"> </span>
        <span data-type="glsl/fragment" data-name="tex" data-src= "<?php echo $dir . "/shaders/texFrag.glsl"?>"> </span>
        <span class="javascript" data-name = "canvas3" data-src = "<?php echo $dir . "/js/canvas3.js" ?>"></span>
    </div>

    <div class="lightbox-cell">
        <div class="cell-content">
            <h3 class="cell-title"> the day I tryna live </h3>
        </div>
        <span data-type="glsl/vertex" data-name="tex" data-src="<?php echo $dir . "/shaders/texVert.glsl"?>"> </span>
        <span data-type="glsl/fragment" data-name="tex" data-src= "<?php echo $dir . "/shaders/texFrag.glsl"?>"> </span>
        <span class="javascript" data-src = "<?php echo $dir . "/js/canvas2.js" ?>"></span>
    </div>

    <div class="lightbox-cell">
        <div class="cell-content">
            <h3 class="cell-title"> the day I tryna live </h3>
        </div>
        <span data-type="glsl/vertex" data-name="tex" data-src="<?php echo $dir . "/shaders/texVert.glsl"?>"> </span>
        <span data-type="glsl/fragment" data-name="tex" data-src= "<?php echo $dir . "/shaders/texFrag.glsl"?>"> </span>
        <span class="javascript" data-src = "<?php echo $dir . "/js/canvas3.js" ?>"></span>
    </div>
</div>

<div class="lb_canvas">
</div>
<div class= "gui-window">
</div>



<script type= "text/javascript" src="<?php echo $dir . "/js/gallery-lightbox.js" ?>"></script>

<?php
get_sidebar();
get_footer();

