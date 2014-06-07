<?php
    /*
     Template Name: Canvas
     */
get_header("noimage"); ?>

<div id="user-scripts" class="user-scripts">
<?php
        // Start the Loop.
        while ( have_posts() ) : the_post();
            the_content();
        endwhile;
    ?>
</div>

<div id="container" class= "viewport">
</div>


<?php
    get_sidebar();
    get_footer();
    
    