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
	
	var ajaxRequest;
	var timeout;

	jQuery('#searchInput').keyup(function() {
		clearTimeout(timeout);
		timeout = setTimeout(function(){autoComplete();}, 1000);
	});

	jQuery('#searchInput').keydown(function() {
		jQuery('#autocompleteBlock').empty();
		clearTimeout(timeout);
	});

	/*
		Dispatch an ajax query for search organizations
	*/
	function autoComplete() {
		var val = jQuery('#searchInput').val();
		if(val != ''){
			ajaxRequest = jQuery.ajax({ // start new ajaxRequest
				url: '/organization/search',
				type: 'post',
				data: 'name='+val,
				success: function(result) {
					var nResults = result.length;
					var childToInsert;
					for(var i = 0 ; i < nResults ; i++){
						childToInsert = 
							'<li onclick="window.location.href=\'/organization/view?id='+result[i]['id']+'\'">'+
								'<img src="/images/'+result[i]['avatar']+'"></img>'+
								'<span>'+result[i]['name']+'</span>'+
							'</li>';
						jQuery('#autocompleteBlock').append(childToInsert);
					}
				}
			});
		}
	}
});