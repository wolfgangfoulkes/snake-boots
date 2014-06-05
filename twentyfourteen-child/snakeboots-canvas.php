<?php
    /*
     Template Name: Canvas
     */
get_header(); ?>

<div class= "viewport-outer">
    <div id="container" class= "viewport-inner">
    </div>
</div>

<script type = "glsl/vertex" data-name = "tex"
        data-src= "<?php echo get_stylesheet_directory_uri() . "/shaders/texVert.glsl" ?>" > </script>
<script type = "glsl/fragment" data-name = "tex"
        data-src= "<?php echo get_stylesheet_directory_uri() . "/shaders/texFrag.glsl" ?>" > </script>
<?php
/*
    <script type="text/javascript" src= "<?php echo get_stylesheet_directory_uri() . "/js/OrbitControls.js" ?>">
    </script>
    <script type="text/javascript" src= "<?php echo get_stylesheet_directory_uri() . "/js/OBJLoader.js" ?>">
    </script>
    <script type="text/javascript" src= "<?php echo get_stylesheet_directory_uri() . "/js/canvas.js" ?>">
    </script>
 */
?>

<?php
    get_sidebar();
    get_footer();