jQuery(document).ready(function($) {
	$('form#contactForm').submit(function() {
        //on "submit" event
		$('form#contactForm .error').remove();
		var hasError = false;
		$('.requiredField').each(function() {
        //for each field labeled "required field.
			if(jQuery.trim($(this).val()) == '') {
            //without whitespace, is it empty?
				var labelText = $(this).prev('label').text();
                //labelText = text of the previous sibling with class "label" (parent item is li).
				$(this).parent().append('<span class="error">You forgot to enter your '+labelText+'.</span>');
                //append to li, a span with an error message, using labelText
				hasError = true;
                //and set an error.
			} else if($(this).hasClass('email')) {
                //if this has a value and it's the "email" field
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if(!emailReg.test(jQuery.trim($(this).val()))) {
                //does it have the correct format for an email address?
					var labelText = $(this).prev('label').text();
                    //labelText = text of the previous sibling with class "label" (parent item is li)
					$(this).parent().append('<span class="error">You entered an invalid '+labelText+'.</span>');
                    //append to li, a span with an error message, using labelText
					hasError = true;
                    //and set an error
				}
			}
		}); //end loop.
		if(!hasError) {
        //if everything's fly
			$('form#contactForm li.buttons button').fadeOut('normal', function() {
            //fade the "submit" button out.
				$(this).parent().append('<img src="/wp-content/themes/td-v3/images/template/loading.gif" alt="Loading&hellip;" height="31" width="31" />');
                //set the button to display an image.
                //add an image.
			});
			var formInput = $(this).serialize();
            //pass form items into string formInput
			$.post($(this).attr('action'),formInput, function(data){
            //using a shorthand ajax function: request data with the url stored in 'action', the formInput and set the callback...
				$('form#contactForm').slideUp(500, function() {	//when form has finished sliding-up.
					$(this).before('<p class="thanks"><strong>Thanks!</strong> Your email was successfully sent. I check my email all the time, so I should be in touch soon.</p>');
                    //display this text prior to the form.
				});
			});
		}
		
		return false;
		
	});
});