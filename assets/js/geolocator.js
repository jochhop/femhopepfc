/**
	Loading organization's maps on the homepage
*/
jQuery(document).ready(function(){

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position) {
			lat = position.coords.latitude;
			long = position.coords.longitude;
			jQuery.ajax({
				type: "POST",
				url: "/location/closest-organizations",
				data: { 'latitude': lat, 'longitude': long }
			})
			.done(function( data ) {
				processMaps( data );
			});
		}); 
	}else{
		long = position.coords.longitude;
		jQuery.ajax({
			type: "POST",
			url: "/location/closest-organizations"
		})
		.done(function( data ) {
			processMaps( data );
		});
	}

	function processMaps(data){
		if(data && data['status'] == 'ok'){
			var orgs = data['orgs'];
			var norgs = orgs.length;
			var map;
			for(var i = 0 ; i < norgs ; i++){
				map = new GMaps({
					div: '#map'+i,
					lat: orgs[i]['organization']['latitude'],
					lng: orgs[i]['organization']['longitude']
				});
				map.addMarker({
					lat: orgs[i]['organization']['latitude'],
					lng: orgs[i]['organization']['longitude'],
					infoWindow: {
						content : orgs[i]['organization']['address']+" "+orgs[i]['organization']['number']+", "+orgs[i]['organization']['city']+", "+orgs[i]['organization']['postalCode'] 
					}
				});
				map.addMarker({
					lat: data['latitude'],
					lng: data['longitude'],
					infoWindow: {
						content : "Tu posición" 
					}
				});
				map.drawRoute({
					origin: [data['latitude'], data['longitude']],
					destination: [orgs[i]['organization']['latitude'], orgs[i]['organization']['longitude']],
					travelMode: 'driving',
					strokeColor: '#131540',
					strokeOpacity: 0.6,
					strokeWeight: 6
				});
				jQuery('#info'+i+' .org-tile-name').html('<a href="organization/view?id='+orgs[i]['organization']['id']+'">'+orgs[i]['organization']['name']+'</a>');
				jQuery('#info'+i+' .org-tile-phone').text(orgs[i]['organization']['requiredPhone']);
				jQuery('#info'+i+' .org-tile-email').html('<a href="mailto:'+orgs[i]['organization']['email']+'" >'+orgs[i]['organization']['email']+'</a>');
			}
		}else{
			alert('Lo sentimos, se ha producido un error. Por favor intente entrar más tarde.');
		}
	}
});