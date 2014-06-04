<?php
    /*
     Template Name: Canvas2
     */
get_header(); ?>

<div class= "viewport-outer">
    <div id="container" class= "viewport-inner">
    </div>
</div>

  <script type="text/javascript" src= "<?php echo get_stylesheet_directory_uri() . "/js/OrbitControls.js" ?>">
    </script>
  <script type="text/javascript" src= "<?php echo get_stylesheet_directory_uri() . "/js/canvas2.js" ?>">
    </script>

<?php
    get_sidebar();
    get_footer();