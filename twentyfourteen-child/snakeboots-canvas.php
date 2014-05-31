<?php
    /*
     Template Name: Canvas
     */
get_header(); ?>

<div id="main-content" class="main-content">
    <div id="primary" class="content-area">
        <div id="content" class="site-content" role="main">

            <pre><canvas id="canvas" width="550" height="375"></canvas></pre>

            <pre><script id="vertex_shader" type="x-shader/x-vert">
                uniform mat4 u_MVPMatrix;   // A constant representing the combined model/view/projection matrix.
                            
                attribute vec4 a_Position;  // Per-vertex position information we will pass in.
                attribute vec4 a_Color;     // Per-vertex color information we will pass in.			  
                          
                varying vec4 v_Color;       // This will be passed into the fragment shader.
                          
                void main()                 // The entry point for our vertex shader.
                {                             
                    v_Color = a_Color;      // Pass the color through to the fragment shader. 
                                            // It will be interpolated across the triangle.
                                            
                    // gl_Position is a special variable used to store the final position.
                    // Multiply the vertex by the matrix to get the final point in normalized screen coordinates.
                    gl_Position = u_MVPMatrix * a_Position;        			                                            			 
                }		  
            </script></pre>

            <pre><script id="fragment_shader" type="x-shader/x-frag">
                precision mediump float;       // Set the default precision to medium. We don't need as high of a
                                               // precision in the fragment shader.				
                varying vec4 v_Color;          // This is the color from the vertex shader interpolated across the 
                                               // triangle per fragment.			  
                void main()
                {
                    gl_FragColor = v_Color;
                }
            </script></pre>

            <pre><script type="text/javascript" src= "http://snake-boots.com/wp-content/themes/twentyfourteen-child/js/canvas.js"> </script></pre>
            <pre><script type="text/javascript">
            <!--
            main();
            //--></script>

		</div><!-- #content -->
	</div><!-- #primary -->
</div><!-- #main-content -->

<?php
    get_sidebar();
    get_footer();