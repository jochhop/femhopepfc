jQuery(document).ready(function(){	
	jQuery('.popover-dismiss').popover({
	  	trigger: 'focus'
	});

	jQuery('#searchButton').click(function(){
		jQuery('#searchBar').toggle('fast');
	});

	/*
		remove all the fields related with the address
	*/
	function clearAddress(){
	    jQuery('#province').empty();
	    jQuery('#city').empty();
	    jQuery('#postalCode').removeClass('input-success');
	    jQuery('#postalCode').addClass('input-error');
	    jQuery('#province').attr('disabled', true);
	    jQuery('#city').attr('disabled', true);
	}

	/*
		Get the cities by a postal code
		@param string pcode
	*/
	function getCities(pcode){
	    var urltosend = 'http://'+window.location.host+'/location/getcities'
	    jQuery.ajax({
	      url: urltosend,
	      data: {'pcode':pcode},
	      type: 'get'
	    }).success(function(response) {
	        if(response.length > 0){
	            jQuery('#city').empty();
	            for(var i = 0; i<response.length;i++){
	                jQuery('#city').append('<option value='+response[i]+'>'+response[i]+'</option>');
	            }
	            //getStreets(pcode, response[0]);
	            jQuery('#city').attr('disabled', false);
	        }else{
	            clearAddress();
	        }
	    });
	}

	/*
		Auto field the inputs for the address
		@param string pcode
	*/
	jQuery('#postalCode').keyup(function(){
	    if(jQuery(this).val().length == 5){
	        var urltosend = 'http://'+window.location.host+'/location/getcounties'
	        jQuery.ajax({
	          url: urltosend,
	          data: {'pcode':jQuery(this).val()},
	          type: 'get'
	        }).success(function(response) {
	            if(response.length > 0){
	                jQuery('#postalCode').removeClass('input-error');
	                jQuery('#postalCode').addClass('input-success');
	                jQuery('#province').empty();
	                for(var i = 0; i<response.length;i++){
	                    jQuery('#province').append('<option value='+response[i]+'>'+response[i]+'</option>');
	                }
	                jQuery("#pcodeerror").hide();
	                jQuery('#province').attr('disabled', false);
	                getCities(jQuery('#postalCode').val());
	            }else{
	                clearAddress();
	                jQuery("#pcodeerror").show();
	            }
	        });
	    }else{
	        clearAddress();
	    }
	});
});