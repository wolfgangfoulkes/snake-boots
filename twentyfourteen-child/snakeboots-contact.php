<?php
/*
Template Name: Contact Form
*/
?>

<?php 
//If the post request is submitted
if(isset($_POST['submitted'])) {
/*on bottom, we set all the values of $_POST: here we use them*/

	//Check to see if the honeypot captcha field was filled in
	if(trim($_POST['checking']) !== '') {
		$captchaError = true;
	} else {
	
		//Check to make sure that the name field is not empty
		if(trim($_POST['contactName']) === '') {
			$nameError = 'You forgot to enter your name.';
			$hasError = true;
		} else {
			$name = trim($_POST['contactName']);
		}
		
		//Check to make sure sure that a valid email address is submitted
		if(trim($_POST['email']) === '')  {
			$emailError = 'You forgot to enter your email address.';
			$hasError = true;
		} else if (!eregi("^[A-Z0-9._%-]+@[A-Z0-9._%-]+\.[A-Z]{2,4}$", trim($_POST['email']))) {
			$emailError = 'You entered an invalid email address.';
			$hasError = true;
		} else {
			$email = trim($_POST['email']);
		}
			
		//Check to make sure comments were entered	
		if(trim($_POST['comments']) === '') {
			$commentError = 'You forgot to enter your comments.';
			$hasError = true;
		} else {
			if(function_exists('stripslashes')) {
				$comments = stripslashes(trim($_POST['comments']));
			} else {
				$comments = trim($_POST['comments']);
			}
		}
			
		//If there is no error, send the email
		if(!isset($hasError)) {

			$emailTo = 'me@somedomain.com';
			$subject = 'Contact Form Submission from '.$name;
			$sendCopy = trim($_POST['sendCopy']);
			$body = "Name: $name \n\nEmail: $email \n\nComments: $comments";
			$headers = 'From: My Site <'.$emailTo.'>' . "\r\n" . 'Reply-To: ' . $email;
			
			mail($emailTo, $subject, $body, $headers);

			if($sendCopy == true) {
				$subject = 'You emailed Your Name';
				$headers = 'From: Your Name <noreply@somedomain.com>';
				mail($email, $subject, $body, $headers);
			}

			$emailSent = true;

		}
	}
} ?>

<?php get_header("welcome"); ?>

<?php if(isset($emailSent) && $emailSent == true) { ?>

	<div class="thanks">
		<h1>Thanks, <?=$name;?></h1>
		<p>Your email was successfully sent. I will be in touch soon.</p>
	</div>

<?php } else { ?>

    <?php /* standard WP LOOP */ ?>
	<?php if (have_posts()) : ?>
	
	<?php while (have_posts()) : the_post(); ?>
		<h1><?php the_title(); ?></h1>
		<?php the_content(); ?>

		<?php if(isset($hasError) || isset($captchaError)) { ?>
			<p class="error">There was an error submitting the form.<p>
		<?php } ?>

        <?php /* OUR CUSTOM FORM */ ?>
        <?php/*below, we set all the values of $_POST, then above we use them*/?>

        <div id="contact_form_block">
            <form action="<?php the_permalink(); ?>" id="contactForm" method="post">
            <?/*when submitted, send data in the body of an http post request to the url of this post.*/?>

                <?php /* these first two items do the same thing: if name has been input, set value to name. if there's an error, display the error's contents in a <span>*/ ?>
                <?php /* lookup: input, label "for" parameter */ ?>
                <ol class="forms">
                    <li><label for="contactName">Name</label>
                        <input type="text" name="contactName" id="contactName" value="<?php if(isset($_POST['contactName'])) echo $_POST['contactName'];?>" class="requiredField"/>
                        <?php if($nameError != '') { ?>
                            <span class="error"><?=$nameError;?></span> <?/* "=" is shorthand for echo methinks */?>
                        <?php } ?>
                    </li>
                    
                    <li><label for="email">Email</label>
                        <input type="text" name="email" id="email" value="<?php if(isset($_POST['email']))  echo $_POST['email'];?>" class="requiredField email"/>
                        <?php if($emailError != '') { ?>
                            <span class="error"><?=$emailError;?></span>
                        <?php } ?>
                    </li>

                    <?php /* this is pretty similar to the preceding two, but it does some formatting */ ?>
                    <li class="textarea"><label for="commentsText">Comments</label>
                        <textarea name="comments" id="commentsText" rows="20" cols="30" class="requiredField"><?php if(isset($_POST['comments'])) { if(function_exists('stripslashes')) { echo stripslashes($_POST['comments']); } else { echo $_POST['comments']; } } ?></textarea>
                        <?php if($commentError != '') { ?>
                            <span class="error"><?=$commentError;?></span> 
                        <?php } ?>
                    </li>

                    <li class="inline"><input type="checkbox" name="sendCopy" id="sendCopy" value="true"<?php if(isset($_POST['sendCopy']) && $_POST['sendCopy'] == true) echo ' checked="checked"'; ?> /><label for="sendCopy">Send a copy of this email to yourself</label></li>

                    <?php /* this is a honeypot captcha: spambots can't see the stylesheet, so they fill in this hidden form. we throw out the post if this is filled */ ?>
                    <li class="screenReader"><label for="checking" class="screenReader">If you want to submit this form, do not enter anything in this field</label><input type="text" name="checking" id="checking" class="screenReader" value="<?php if(isset($_POST['checking']))  echo $_POST['checking'];?>" /></li>

                    <li class="buttons"><input type="hidden" name="submitted" id="submitted" value="true" /><button type="submit">Email me &raquo;</button></li>
                </ol>
            </form>
        </div>
	
		<?php endwhile; ?>
	<?php endif; ?>
<?php } ?>

<?php get_footer(); ?>