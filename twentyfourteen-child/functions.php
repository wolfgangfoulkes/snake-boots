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
            'default-image' => get_stylesheet_directory_uri() . "/images/cooltextwpsize.png",
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
            'wp-head-callback' => 'snakeboots_header_style',
            // Admin header style callback
            'admin-head-callback' => 'snakeboots_admin_header_style'
		)
	);
}
    


function snakeboots_load_scripts() /*function will be called in every page that uses enqueu-scripts*/
{
    $s_dir = get_stylesheet_directory_uri();

    /* Enqueue custom Javascript here using wp_enqueue_script(). */
    /*****LIBRARIES*****/
    wp_register_script(
                       "webgl_utils",
                       get_stylesheet_directory_uri() . "/js/libs/webgl_utils.js",
                       array("jquery")
                       );
                        /* get_template_directory_uri() would give us the parent theme, because we're using page.php */
                        /* note the '/' before js. safeguards using the correct directory */
                        /* last parameter is an array of dependencies */
    wp_register_script(
                       "glmatrix",
                       get_stylesheet_directory_uri() . "/js/libs/glmatrix.js",
                       array("jquery", "webgl_utils")
                       );
    
    wp_register_script(
                       "three-min",
                       get_stylesheet_directory_uri() . "/js/libs/three/three.min.js",
                       array("jquery")
                       );
    
    wp_register_script(
                       "three-orbit-controls",
                       get_stylesheet_directory_uri() . "/js/libs/three/OrbitControls.js",
                       array("jquery", "three-min")
                       );
    wp_register_script(
                       "three-obj-loader",
                       get_stylesheet_directory_uri() . "/js/libs/three/OBJLoader.js",
                       array("jquery", "three-min")
                       );
    
    wp_register_script(
                       "dat-gui",
                       get_stylesheet_directory_uri() . "/js/libs/dat.gui.min.js",
                       array("jquery")
                       );
    
    
    /*****SCRIPTS*****/
    wp_register_script(
                       "contact-form",
                       get_stylesheet_directory_uri() . "/js/contact-form.js",
                       array("jquery")
                       );
    
    wp_register_script(
                       "canvas",
                       get_stylesheet_directory_uri() . "/js/canvas.js",
                       array("jquery", "three-min", "three-orbit-controls", "three-obj-loader"),
                       0.0,
                       true //call in footer
                       );
    
    wp_register_script(
                       "lb-preload",
                       get_stylesheet_directory_uri() . "/js/lb-preload.js",
                       array("jquery", "three-min", "three-obj-loader"),
                       0.0,
                       true
                       );
    
    /*****ALL PAGES*****/
    wp_enqueue_script("webgl_utils");
    wp_enqueue_script("glmatrix");
    wp_enqueue_script("three-min");
    wp_enqueue_script("three-orbit-controls");
    wp_enqueue_script("three-obj-loader");
    wp_enqueue_script("dat-gui");
    
    /*****CONDITIONAL*****/
    /*  script that animates contact-form */
    if (is_page_template("snakeboots-contact.php")) /*with is_page() we would use the slug*/
    {
        wp_enqueue_script( "contact-form" );
    }
    
    
    if (is_page_template("snakeboots-canvas.php"))
    {
        wp_enqueue_script("three-orbit-controls");
        wp_enqueue_script("three-obj-loader");
        wp_enqueue_script("canvas");
        wp_localize_script("canvas", "canvas_vars", array( "path" => get_stylesheet_directory_uri() ) );
    }
    
    if (is_page_template("snakeboots-preload.php"))
    {
        wp_enqueue_script("three-orbit-controls");
        wp_enqueue_script("three-obj-loader");
        wp_enqueue_script("lb-preload");
        wp_localize_script("lb-preload", "sb_local", array( "dir" => $s_dir, "imagesURI" => array("uv_grid" => $s_dir . "/images/UV_Grid_Sm.jpg", "wg_text" => $s_dir . "/images/cooltextwpsize.png") ));
    }
    
    /* Load the comment reply JavaScript. */
    if ( is_singular() && get_option( 'thread_comments' ) && comments_open() )
    {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action("wp_enqueue_scripts", "snakeboots_load_scripts");
/* action called by default in the head */



function snakeboots_load_styles()
{
    wp_register_style(
                       "contact-form",
                       get_stylesheet_directory_uri() . "/styles/contact-form.css"
                       );
    wp_register_style(
                       "canvas",
                       get_stylesheet_directory_uri() . "/styles/canvas.css"
                       );
    
    wp_register_style(
                       "lb-gallery",
                       get_stylesheet_directory_uri() . "/styles/lb-gallery.css"
                       );
    
    if (is_page_template("snakeboots-contact.php"))
    {
        wp_enqueue_style("contact-form");
    }
    
    if (is_page_template("snakeboots-canvas.php"))
    {
        wp_enqueue_style("canvas");
    }
    
    if (is_page_template("snakeboots-preload.php"))
    {
        wp_enqueue_style("lb-gallery");
    }
}
add_action("wp_enqueue_scripts", "snakeboots_load_styles");
    

function temp_dir_func($atts, $content = null)
{
    $args = shortcode_atts( array("href" => ""), /* defaults */
                          $atts);
    $dir = trailingslashit( get_template_directory_uri() ); /*if there's a trailing slash, remove. add trailing slash */
    return $dir . $args["href"];
}

function style_dir_func($atts, $content = null)
{
    $args = shortcode_atts( array("href" => ""), /* defaults */
                          $atts);
    $dir = trailingslashit( get_stylesheet_directory_uri() );
    return $dir . $args["href"];
}


/*****SHORTCODES*****/
function register_shortcodes()
{
    add_shortcode("temp_dir", "temp_dir_func");   /* returns string */
    add_shortcode("style_dir", "style_dir_func"); /* returns string */
}
add_action("init", register_shortcodes);

    
    
/** modified from twentyfourteen/inc/custom-header
 * Style the header text displayed on the blog.
 *
 * get_header_textcolor() options: Hide text (returns 'blank'), or any hex value.
 *
 * @since Twenty Thirteen 1.0
 */
function snakeboots_header_style() {
	$header_image = get_header_image();
	$text_color   = get_header_textcolor();
    
	// If no custom options for text are set, let's bail.
	if ( empty( $header_image ) && $text_color == get_theme_support( 'custom-header', 'default-text-color' ) )
		return;
    
	// If we get this far, we have custom styles.
	?>
	<style type="text/css" id="twentyfourteen-header-css">
	<?php
    if ( ! empty( $header_image ) ) :
        ?>
		.site-header
        {
            /*
            background: url(<?php header_image(); ?>) no-repeat scroll top;
            background-size: 1600px auto;
            padding:44px 0 <?php echo HEADER_IMAGE_HEIGHT; ?>px 0; /* Bottom padding is the same height as the image */
            overflow: visible;
            */
		}
	<?php
    endif;
    
    // Has the text been hidden?
    if ( ! display_header_text() ) :
        ?>
        .site-header
        {
            /*
            padding: 0 0 <?php echo HEADER_IMAGE_HEIGHT; ?>px 0; /* Bottom padding is the same height as the image */
            overflow: visible;
            */
        }
		.site-title,
		.site-description
        {
            display: none;
            <?php /* position: absolute !important; */?>
            <?php /* clip: rect(1px 1px 1px 1px); /* IE7 */?>
            <?php /* clip: rect(1px, 1px, 1px, 1px); */ ?>
		}
	<?php
    if ( empty( $header_image ) ) :
        ?>
		.site-header .home-link
        {
			min-height: 0;
		}
	<?php
    endif;
    
    // If the user has set a custom color for the text, use that.
    elseif ( $text_color != get_theme_support( 'custom-header', 'default-text-color' ) ) :
	?>
    .site-title,
    .site-description
    {
        color: #<?php echo esc_attr( $text_color ); ?>;
    }
	<?php endif; ?>
	</style>
	<?php
}

/** modified from twentyfourteen/inc/custom-header
 * Style the header image displayed on the Appearance > Header admin panel.
 *
 * @since Twenty Thirteen 1.0
 */
function snakeboots_admin_header_style()
{
	$header_image = get_header_image();
    ?>
	<style type="text/css" id="twentyfourteen-admin-header-css">
	.appearance_page_custom-header
    #headimg
    {
        /*
        border: none;
        -webkit-box-sizing: border-box;
        -moz-box-sizing:    border-box;
        box-sizing:         border-box;
        <?php
        if ( ! empty( $header_image ) )
        {
            echo 'background: url(' . esc_url( $header_image ) . ') no-repeat scroll top; background-size: 1600px auto;';
        } ?>
        padding: 0 20px;
        */
    }
    #headimg .home-link
    {
        /*
        -webkit-box-sizing: border-box;
        -moz-box-sizing:    border-box;
        box-sizing:         border-box;
        margin: 0 auto;
        max-width: 1040px;
        <?php
        if ( ! empty( $header_image ) || display_header_text() )
        {
            echo 'min-height: 230px;';
        } ?>
        width: 100%;
        */
    }
    <?php if ( ! display_header_text() ) : ?>
    #headimg h1,
    #headimg h2
    {
        display: none;
        <?php /* position: absolute !important; */?>
        <?php /* clip: rect(1px 1px 1px 1px); /* IE7 */?>
        <?php /* clip: rect(1px, 1px, 1px, 1px); */ ?>
    }
    <?php endif; ?>
    #headimg h1
    {
        /*
        font: bold 60px/1 Bitter, Georgia, serif;
        margin: 0;
        padding: 58px 0 10px;
        */
    }
    #headimg h1 a
    {
        /*
        text-decoration: none;
        */
    }
    #headimg h1 a:hover
    {
        /*
        text-decoration: underline;
        */
    }
    #headimg h2
    {
        /*
        font: 200 italic 24px "Source Sans Pro", Helvetica, sans-serif;
        margin: 0;
        text-shadow: none;
        */
    }
    .default-header img
    {
        /*
        max-width: 230px;
        width: auto;
        */
    }
    </style>
<?php
}

/**
 * Output markup to be displayed on the Appearance > Header admin panel.
 *
 * This callback overrides the default markup displayed there.
 *
 * @since Twenty Thirteen 1.0
 */
function snakeboots_admin_header_image()
{
?>
/*
<div id="headimg" style="background: url(<?php header_image(); ?>) no-repeat scroll top; background-size: 1600px auto;">
<?php $style = ' style="color:#' . get_header_textcolor() . ';"'; ?>
    <div class="home-link">
        <h1 class="displaying-header-text"><a id="name"<?php echo $style; ?> onclick="return false;" href="#"><?php bloginfo( 'name' ); ?></a></h1>
        <h2 id="desc" class="displaying-header-text"<?php echo $style; ?>><?php bloginfo( 'description' ); ?></h2>
    </div>
</div>
 */
<?php }