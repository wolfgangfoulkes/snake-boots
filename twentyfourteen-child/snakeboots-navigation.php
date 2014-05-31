<?php
    /*
     Template Name: Navigation
     */ ?>

<?php get_header("welcome"); ?>
<body <?php body_class("navigation"); ?>>
    <div class = "sb-nav-grid">

        <div class = "sb-nav-cell">
            <div class = "sb-nav-rel">
                <a class= "sb-nav-abs" href= "<?php echo esc_url( home_url( '/' ) ); ?>">
                </a>
            </div>
        </div>

        <div class = "sb-nav-cell">
            <div class = "sb-nav-rel">
                <a class= "sb-nav-abs" href= "<?php echo esc_url( home_url( '/' ) ); ?>">
                </a>
            </div>
        </div>

        <div class = "sb-nav-cell">
            <div class = "sb-nav-rel">
                <a class= "sb-nav-abs" href= "<?php echo esc_url( home_url( '/' ) ) . "video"; ?>">
                </a>
            </div>
        </div>

        <div class = "sb-nav-cell">
            <div class = "sb-nav-rel">
                <a class= "sb-nav-abs" href= "<?php echo esc_url( home_url( '/' ) ) . "navigation"; ?>">
                </a>
            </div>
        </div>

    </div>
</body>
<?php get_footer(); ?>