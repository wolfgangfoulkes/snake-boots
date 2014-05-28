<?php
/*Template Name: welcome*/
?>
<?php
/*test template for an html tutorial*/
?>

<?php get_header("welcome"); ?>

<div class="snakeboots-welcome-block">
    <a class="snakeboots-welcome-link" href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home">
    <?php /*use a background image here*/ ?>
    </a>
</div>

<?php get_sidebar(); ?>
<?php get_footer(); ?>