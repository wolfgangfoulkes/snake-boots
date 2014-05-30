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
            <a class= "sb-nav-link2" href= "<?php echo esc_url( home_url( '/' ) ); ?>">
            </a>
        </div>
    </div>
</body>
<?php get_sidebar(); ?>
<?php get_footer(); ?>