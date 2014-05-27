<?php
/**
 * Custom Child Theme Functions
 *
 * This file's parent directory can be moved to the wp-content/themes directory 
 * to allow this Child theme to be activated in the Appearance - Themes section of the WP-Admin.
 *
 * Included is a basic theme setup that will add support for custom header images and custom 
 * backgrounds. There are also a set of commented theme supports that can be uncommented if you need
 * them for backwards compatibility. If you are starting a new theme, these legacy functionality can be deleted.  
 *
 * More ideas can be found in the community documentation for Thematic
 * @link http://docs.thematictheme.com
 *
 * @package ThematicSampleChildTheme
 * @subpackage ThemeInit
 */

/**
 * Define theme setup
 */
    
add_action('after_setup_theme', 'snakeboots_setup', 11); //11 so it is loaded AFTER the parent's functions.php
    //the default is the other way, so that theme developers can decide using conditionals what will be overridden.

function snakeboots_setup()
{
	
	/*
	 * Add support for custom background
	 * 
	 * Allow users to specify a custom background image or color.
	 * Requires at least WordPress 3.4
	 * 
	 * @link http://codex.wordpress.org/Custom_Backgrounds Custom Backgrounds
	 */
	add_theme_support( 'custom-background' ); //can add defaults to this
	
    /**
	 * Add support for custom headers
	 * 
	 * Customize to match your child theme layout and style.
	 * Requires at least WordPress 3.4
	 * 
	 * @link http://codex.wordpress.org/Custom_Headers Custom Headers
	 */
	add_theme_support( 'custom-header',
        array(
              // Header image default
            'default-image' => "<?php echo get_stylesheet_directory_uri();?>/images/cooltextwpsize.png",
            // Header text display default
            'header-text' => false,
            // Header text color default
            'default-text-color' => '000',
            // Header image width (in pixels)
            'width'	=> '960',
            // Header image height (in pixels)
            'height' => '180',
            // Header image random rotation default
            'random-default' => false,
            // Template header style callback
            /* 'wp-head-callback' => 'childtheme_header_style', */
            // Admin header style callback
            /* 'admin-head-callback' => 'childtheme_admin_header_style' */
		)
	);
}
    
function snakeboots_load_scripts()
{
    /* Enqueue custom Javascript here using wp_enqueue_script(). */
    
    /* Load the comment reply JavaScript. */
    if ( is_singular() && get_option( 'thread_comments' ) && comments_open() )
    {
        wp_enqueue_script( 'comment-reply' );
    }
}
    
?>