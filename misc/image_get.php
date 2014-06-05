<?php
    /* $args = array( 'post_type' => 'attachment', 'posts_per_page' => -1, 'post_status' => 'any', 'post_parent' => null ); */
    /* $attachments = get_posts( $args ); */
    ?>

<?php $attachments = array(
                           0 => 101,
                           1 => 47,
                           );
    $iter = 0;
    ?>

<?php $image_attributes = wp_get_attachment_image_src( $attachments[$iter++] );
    if( $image_attributes ) {
        ?>
<img src="<?php echo $image_attributes[0]; ?>" width="<?php echo $image_attributes[1]; ?>" height="<?php echo $image_attributes[2]; ?>">
<?php } ?>
