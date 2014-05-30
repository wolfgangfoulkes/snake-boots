<?php
/*Template Name: welcome*/
?>
<?php
/*test template for an html tutorial*/
?>

<?php get_header("welcome"); ?>

<div class="snakeboots-welcome-block">
    <a class="snakeboots-welcome-link" href="<?php echo get_page_uri(99);?>" rel="navigation">
    <?php /*get_page_uri returns a link with site/pagename. this is not the default setting for page permalinks*/ ?>
    <?php /*use a background image here*/ ?>
    </a>
</div>

<?php get_footer(); ?>