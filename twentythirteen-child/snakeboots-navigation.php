<?php
    /*
     Template Name: Navigation
     */ ?>


<?php get_header("welcome"); ?>
<body <?php body_class("navigation"); ?>>
    <div class = "sb-nav-grid">
        <div class = "sb-nav-row">
            <a class= "sb-nav-link1" href= "<?php echo esc_url( home_url( '/' ) ); ?>">
            </a>
            <a class= "sb-nav-link2" href= "<?php echo esc_url( home_url( '/' ) ); ?>">
            </a>
        </div>
        <div class = "sb-nav-row">
            <a class= "sb-nav-link1" href= "<?php echo esc_url( home_url( '/' ) ); ?>">
            </a>
            <?php $image_attributes = wp_get_attachment_image_src( 101 );
                if( $image_attributes ) {
                    ?>
            <a class= "sb-nav-link2" href= "<?php echo esc_url( home_url( '/' ) ); ?>" style = "background-image: url(<?php echo $image_attributes[0]; ?>);">
                <?php }/*attributes[1-2] are width and height*/?>

            </a>
        </div>
    </div>
</body>
<?php get_sidebar(); ?>
<?php get_footer(); ?>