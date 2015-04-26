/**
 * OrganizationController
 *
 * @description :: Server-side logic for managing Organizationcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 /* modules required */
 var fs = require('fs'),
 util = require('util'),
 gmaps = require('googlemaps'),
 uuid = require('node-uuid');

 /* path for upload the images */
 var UPLOAD_PATH = '../../assets/images';
 var NO_USER_PHOTO = 'no_image.png';

 module.exports = {

	/*
	* Render the view with the organizations collection
	*/
	'index' : function(req, res){
		res.view();
	},

	/**
	* Render a view for add a new organization
	*/
	'register' :  function(req, res){
		if(req.session.Org){
			res.redirect('/organization/view?id:'+req.session.Org.id);
		}else{
			res.view();
		}
	},

	/**
	* Render the view for add a new suborganization
	*/
	'addsuborg' :  function(req, res){
		res.view();
	},

	/**
	* Create new organization action
	*/
	'create' : function(req, res, next){
		var todayDate = Date();
		var uploadFile = req.file('avatar');

		uploadFile.upload({dirname : UPLOAD_PATH}, function onUploadComplete (err, files) {                                                         
			
			if (err) return res.serverError(err);

			if(files.length > 0){
				var fileNameSplitted = files[0]['fd'].split("/");
				var fileName = fileNameSplitted[fileNameSplitted.length - 1];
			}else{
				var fileName = NO_USER_PHOTO;
			}

			var mapName = uuid.v4()+'.png';
			
			Organization.create({
				email : req.param('email'),
				password : req.param('password'),
				name : req.param('name'),
				nif : req.param('nif'),
				services : req.param('services'),
				description : req.param('description'),
				avatar : fileName,
				map : mapName,
				number : req.param('number'),
				address : req.param('address'),
				province : req.param('province'),
				city : req.param('city'),
				postalCode : req.param('postalCode'),
				requiredPhone : req.param('requiredPhone'),
				extraPhone : req.param('extraPhone'),
				registerDate : todayDate,
				accessDate : todayDate,
				passwordConfirmation : req.param('passwordConfirmation')
			}, function organizationCreated(err, organization){

				if(err) {
					console.log(err);

					req.session.flash = {
						err: err
					}                    

					return res.redirect('/');
				}

				var completAddress = organization.address+" "+organization.number+","+organization.country+","+organization.province+","+organization.city;
				
				markers = [
					{ 'location': completAddress }
				]

				util.puts(gmaps.staticMap(completAddress, 15, '640x400', function(err, data){
					if (err) return res.serverError(err);
					
					var map = fs.writeFileSync('assets/images/maps/'+mapName, data, 'binary');
					
					gmaps.geocode(completAddress, function(err, data){
						organization.latitude = data["results"][0]["geometry"]["location"]["lat"];
						organization.longitude = data["results"][0]["geometry"]["location"]["lng"];
						organization.save();
					});
					
					req.session.flash = {
						success: "Usuario creado correctamente, para acceder a su cuenta por favor, introduzca su email y su contraseña en la barra superior."
					}
				}, false, 'roadmap', markers));
			});
		});
		return res.redirect('/');
	},

	/**
	* Create new sub organization action
	*/
	'createsub' : function(req, res, next){
		var todayDate = Date();
		var uploadFile = req.file('avatar');

		uploadFile.upload({dirname : UPLOAD_PATH}, function onUploadComplete (err, files) {                                                         
			
			if (err) return res.serverError(err);

			if(files.length > 0){
				var fileNameSplitted = files[0]['fd'].split("/");
				var fileName = fileNameSplitted[fileNameSplitted.length - 1];
			}else{
				var fileName = NO_USER_PHOTO;
			}

			var mapName = uuid.v4()+'.png';
			
			Organization.create({
				email : req.param('email'),
				password : req.param('password'),
				name : req.param('name'),
				nif : req.param('nif'),
				services : req.param('services'),
				description : req.param('description'),
				avatar : fileName,
				map : mapName,
				number : req.param('number'),
				address : req.param('address'),
				province : req.param('province'),
				city : req.param('city'),
				postalCode : req.param('postalCode'),
				requiredPhone : req.param('requiredPhone'),
				extraPhone : req.param('extraPhone'),
				registerDate : todayDate,
				accessDate : todayDate,
				passwordConfirmation : req.param('passwordConfirmation'),
				headquarter : req.session.User.id
			}, function organizationCreated(err, organization){

				if(err) {
					console.log(err);

					req.session.flash = {
						err: err
					}                    

					return res.redirect('/');
				}

				var completAddress = organization.address+" "+organization.number+","+organization.country+","+organization.province+","+organization.city;
				
				markers = [
					{ 'location': completAddress }
				]

				util.puts(gmaps.staticMap(completAddress, 15, '640x400', function(err, data){
					if (err) return res.serverError(err);
					
					var map = fs.writeFileSync('assets/images/maps/'+mapName, data, 'binary');
					
					gmaps.geocode(completAddress, function(err, data){
						organization.latitude = data["results"][0]["geometry"]["location"]["lat"];
						organization.longitude = data["results"][0]["geometry"]["location"]["lng"];
						organization.save();
					});
					
					req.session.flash = {
						success: "Usuario creado correctamente, para acceder a su cuenta por favor, introduzca su email y su contraseña en la barra superior."
					}
				}, false, 'roadmap', markers));
			});
		});
		return res.redirect('/');
	},

	/**
	* Edit user data
	*/
	// 'update' : function(req, res, next){
	// 	var uploadFile = req.file('avatar');

	// 	uploadFile.upload({dirname : UPLOAD_PATH}, function onUploadComplete (err, files) {                                                         
		
	// 	  if (err) return res.serverError(err);

	// 	  if(files.length > 0){
	// 	    var fileNameSplitted = files[0]['fd'].split("/");
	// 	    var fileName = fileNameSplitted[fileNameSplitted.length - 1];
	// 	  }else{
	// 	    var fileName = '';
	// 	  }
	// 	  console.log("Organization id: "+req.param('organizationId'));
	// 	  Organization.update(
	// 	  req.param('organizationId'),
	// 	  {
	// 	    name : req.param('name'),
	// 	    nif : req.param('nif'),
	// 	    surname : req.param('services'),
	// 	    number : req.param('number'),
	// 	    address : req.param('address'),
	// 	    province : req.param('province'),
	// 	    city : req.param('city'),
	// 	    postalCode : req.param('postalCode'),
	// 	    requiredPhone : req.param('requiredPhone'),
	// 	    extraPhone : req.param('extraPhone')
	// 	  }, function organizationUpdated(err, organization){

	// 	    if(err) {
	// 	      console.log(err);

	// 	      req.session.flash = {
	// 	        err: err
	// 	      }                    

	// 	      return res.redirect('/');
	// 	    }else{

	// 	      if(req.param('password') && req.param('password') != '' && req.param('password') == req.param('passwordConfirmation')){
		
	// 	        require('bcrypt').hash(req.param('password'), 10, function passwordEncripted(err, password){
	// 	          if(err) return next(err);

	// 	          if(fileName != ''){
	// 	            if(organization.avatar != NO_USER_PHOTO){
	// 	              fs.unlink(UPLOAD_PATH + '/' + organization.avatar, function (err) {
	// 	                if (err) throw err;
	// 	                console.log('successfully deleted '+UPLOAD_PATH + '/' + organization.avatar);
	// 	              });
	// 	            }
	// 	            organization.avatar = fileName;
	// 	          }

	// 	          console.log(fileName);

	// 	          organization.password = password;
	// 	          organization.passwordConfirmation = passwordConfirmation;
	// 	          organization.save();
	// 	        });

	// 	      }else{
	// 	      	console.log("This is the id: "+organization.id);
	//     		if(fileName != ''){
	// 	            if(organization.avatar != NO_USER_PHOTO){
	// 	              fs.unlink(UPLOAD_PATH + '/' + organization.avatar, function (err) {
	// 	                if (err) throw err;
	// 	                console.log('successfully deleted '+UPLOAD_PATH + '/' + organization.avatar);
	// 	              });
	// 	            }
	// 	            organization.avatar = fileName;
	// 	            organization.save();
 //          		}
	// 	      }
	// 	    }
	
	// 	    req.session.flash = {
	// 	      success: "Organización editada correctamente"
	// 	    }
	// 	    res.redirect('/organization/view?id='+req.param('organizationId'));
	// 	  });
	// 	});
	// },

	// /*
	// * Edit organization function
	// */
	// 'update' : function(req, res, next){
	// 	if(req.session.User && (req.session.User.rol > 1 || req.session.User.id == req.param('organizationId'))){

	// 		Organization.findOne().where({id : req.param('organizationId')}).then(function(organization){
				
	// 			if(organization){
	// 				var uploadFile = req.file('avatar');

	// 				uploadFile.upload({dirname : UPLOAD_PATH}, function onUploadComplete (err, files) {                                                         
						
	// 					if (err) return res.serverError(err);

	// 					if(files.length > 0){
	// 						var fileNameSplitted = files[0]['fd'].split("/");
	// 						var fileName = fileNameSplitted[fileNameSplitted.length - 1];
	// 					}else{
	// 						var fileName = '';
	// 					}

	// 			        //direct params
	// 			        organization.name = req.param('name');
	// 			        organization.services = req.param('services');
	// 			        organization.requiredPhone = req.param('requiredPhone');
	// 			        organization.extraPhone = req.param('extraPhone');

	// 			        var addressChanged = false;
	// 			        if(req.param('number') != '' && req.param('number') != organization.number){
	// 			        	organization.number = req.param('number');
	// 			        	addressChanged = true;
	// 			        }
	// 			        if(req.param('address') != '' && req.param('address') != organization.address){
	// 			        	organization.address = req.param('address');
	// 			        	addressChanged = true;
	// 			        }
	// 			        if(req.param('province') != '' && req.param('province') != organization.province){
	// 			        	organization.province = req.param('province');
	// 			        	addressChanged = true;
	// 			        }
	// 			        if(req.param('city') != '' && req.param('city') != organization.city){
	// 			        	organization.city = req.param('city');
	// 			        	addressChanged = true;
	// 			        }
	// 			        if(req.param('postalCode') != '' && req.param('postalcode') != organization.postalCode){
	// 			        	organization.postalCode = req.param('postalCode');
	// 			        	addressChanged = true;
	// 			        }

	// 			        //address changed
	// 			        if(addressChanged){
	// 			        	var completAddress = organization.address+" "+organization.number+","+organization.country+","+organization.province+","+organization.city;
	// 			        	var mapName = uuid.v4()+'.png';

	// 			        	markers = [
	// 			        		{ 'location': completAddress }
	// 			        	]
	// 			        	fs.unlink('assets/images/maps/' + organization.map, function (err) {
	// 			        		if (err) throw err;
	// 			        		console.log('successfully deleted '+UPLOAD_PATH + '/maps/' + organization.map);
			        		
	// 			        		util.puts(gmaps.staticMap(completAddress, 15, '640x400', function(err, data){
	// 			        			if (err) return res.serverError(err);
				        			
	// 			        			var map = fs.writeFileSync('assets/images/maps/'+mapName, data, 'binary');

	// 			        			gmaps.geocode(completAddress, function(err, data){
	// 			        				organization.map = mapName;
	// 			        				organization.latitude = data["results"][0]["geometry"]["location"]["lat"];
	// 			        				organization.longitude = data["results"][0]["geometry"]["location"]["lng"];
	// 			        				organization.save();
	// 			        			});

	// 		        			}, false, 'roadmap', markers));
	// 		        		});
	// 		        	}

	// 			        //avatar
	// 			        if(fileName != ''){
	// 			        	if(organization.avatar != NO_USER_PHOTO){
	// 			        		fs.unlink('assets/images/' + organization.avatar, function (err) {
	// 			        			if (err) throw err;
	// 			        			console.log('successfully deleted '+UPLOAD_PATH + '/' + organization.avatar);
	// 			        		});
	// 			        	}
	// 			        	organization.avatar = fileName;
	// 			        }

	// 			        //organization saved
	// 			        organization.save(function(err){
	// 			        	if(err) {
	// 			        		console.log(err);
	// 			        		req.session.flash = {
	// 			        			error: "La organización no ha podido ser editada"
	// 			        		}
	// 			        		res.redirect('/organization/view?id='+req.param('organizationId'));
	// 			        		return;
	// 			        	}
	// 			        });

	// 			        //changing password
	// 			        if(req.param('password') && req.param('password') != '' && req.param('password') == req.param('passwordConfirmation')){
				        	
	// 			        	require('bcrypt').hash(req.param('password'), 10, function passwordEncripted(err, password){
	// 			        		if(err) return next(err);

	// 			        		organization.password = password;
	// 			        		organization.passwordConfirmation = password;
	// 			        		organization.save();
	// 			        	});
	// 			        }
	// 		        	res.redirect('/organization/view?id='+req.param('organizationId'));
	// 		        	return ;
	// 		    	});
	// 			}else{
	// 				req.session.flash = {
	// 					error: "La organización no se ha encontrado"
	// 				}
	// 				res.redirect('/');
	// 				return;
	// 			}

	// 			req.session.flash = {
	// 				success: "Organización editada correctamente, verás tus cambios aplicados cuando vuelvas a logearte"
	// 			}
	// 		});

	// 	}else{
	// 		req.session.flash = {
	// 			error: "No tienes permisos para realizar esta acción."
	// 		}
	// 		res.redirect('/');
	// 	}
	// },

	/*
	* Edit organization function
	*/
	'update' : function(req, res, next){
		if(req.session.User && (req.session.User.rol > 1 || req.session.User.id == req.param('organizationId'))){

			Organization.findOne().where({id : req.param('organizationId')}).then(function(organization){
				
				if(organization){
					var uploadFile = req.file('avatar');

					uploadFile.upload({dirname : UPLOAD_PATH}, function onUploadComplete (err, files) {                                                         
						
						if (err) return res.serverError(err);

						if(files.length > 0){
							var fileNameSplitted = files[0]['fd'].split("/");
							var fileName = fileNameSplitted[fileNameSplitted.length - 1];
						}else{
							var fileName = '';
						}

				        //direct params
				        organization.name = req.param('name');
				        organization.services = req.param('services');
				        organization.requiredPhone = req.param('requiredPhone');
				        organization.extraPhone = req.param('extraPhone');

				        var addressChanged = false;
				        if(req.param('number') != '' && req.param('number') != organization.number){
				        	organization.number = req.param('number');
				        	addressChanged = true;
				        }
				        if(req.param('address') != '' && req.param('address') != organization.address){
				        	organization.address = req.param('address');
				        	addressChanged = true;
				        }
				        if(req.param('province') != '' && req.param('province') != organization.province){
				        	organization.province = req.param('province');
				        	addressChanged = true;
				        }
				        if(req.param('city') != '' && req.param('city') != organization.city){
				        	organization.city = req.param('city');
				        	addressChanged = true;
				        }
				        if(req.param('postalCode') != '' && req.param('postalcode') != organization.postalCode){
				        	organization.postalCode = req.param('postalCode');
				        	addressChanged = true;
				        }

				        //address changed
				        if(addressChanged){
				        	var completAddress = organization.address+" "+organization.number+","+organization.country+","+organization.province+","+organization.city;
				        	var mapName = uuid.v4()+'.png';

				        	markers = [
				        		{ 'location': completAddress }
				        	]
				        	fs.unlink('assets/images/maps/' + organization.map, function (err) {
				        		if (err) throw err;
				        		console.log('successfully deleted '+UPLOAD_PATH + '/maps/' + organization.map);
			        		
				        		util.puts(gmaps.staticMap(completAddress, 15, '640x400', function(err, data){
				        			if (err) return res.serverError(err);
				        			
				        			var map = fs.writeFileSync('assets/images/maps/'+mapName, data, 'binary');

				        			gmaps.geocode(completAddress, function(err, data){
				        				organization.map = mapName;
				        				organization.latitude = data["results"][0]["geometry"]["location"]["lat"];
				        				organization.longitude = data["results"][0]["geometry"]["location"]["lng"];
				        				organization.save();
				        			});

			        			}, false, 'roadmap', markers));
			        		});
			        	}

				        //avatar
				        if(fileName != ''){
				        	if(organization.avatar != NO_USER_PHOTO){
				        		fs.unlink('assets/images/' + organization.avatar, function (err) {
				        			if (err) throw err;
				        			console.log('successfully deleted '+UPLOAD_PATH + '/' + organization.avatar);
				        		});
				        	}
				        	organization.avatar = fileName;
				        }

				        //organization saved
				        organization.save(function(err){
				        	if(err) {
				        		console.log(err);
				        		req.session.flash = {
				        			error: "La organización no ha podido ser editada"
				        		}
				        		res.redirect('/organization/view?id='+req.param('organizationId'));
				        		return;
				        	}
				        });

				        //changing password
				        if(req.param('password') && req.param('password') != '' && req.param('password') == req.param('passwordConfirmation')){
				        	
				        	require('bcrypt').hash(req.param('password'), 10, function passwordEncripted(err, password){
				        		if(err) return next(err);

				        		organization.password = password;
				        		organization.passwordConfirmation = password;
				        		organization.save();
				        	});
				        }

				        if(req.session.User && req.session.User.id == organization.id){
				        	req.session.User = organization;
				        }

			        	res.redirect('/organization/view?id='+req.param('organizationId'));
			        	return ;
			    	});
				}else{
					req.session.flash = {
						error: "La organización no se ha encontrado"
					}
					res.redirect('/');
					return;
				}

				req.session.flash = {
					success: "Organización editada correctamente, verás tus cambios aplicados cuando vuelvas a logearte"
				}
			});

		}else{
			req.session.flash = {
				error: "No tienes permisos para realizar esta acción."
			}
			res.redirect('/');
		}
	},

	/**
	* Render the organization view
	*/
	'view' : function(req, res, next){
		Organization.findOne(req.param('id'), function foundOrganization(err, organization){
			if(err) return next(err);

			if(!organization) return next();

			if(req.session.User && req.session.User.rol == 0){

				Favorite.findOne({'idUser' : req.session.User.id, 'idOrganization' : organization.id}, function (err, favorite){
					if(favorite){
						res.view({
							organization : organization,
							isFavorite : true
						});
					}else{
						res.view({
							organization : organization,
							isFavorite : false
						});
					}
				});

			}else{
				res.view({
					organization : organization,
				});
			}
		});
	},

	/**
	* Renders the messages list
	*/
	'messages' : function(req, res, next){
		if(req.session.User && req.session.User.rol == 2 || req.session.User.id == req.param('id')){
		  	Message.find({$or : [{'idSender' : req.param('id'), 'roleSender' : 1}, {'idReceiver' : req.param('id'), 'roleReceiver' : 1}]}).sort([['sentDate', 1]]).exec(function foundMessages(err, messages){
			    if(err) return next(err);
			    
			    res.view({
		      		'messages' : messages
		    	});
		  	});
		}else{
			req.session.flash = {
				error: "No tienes permisos para realizar esta acción."
			}
			res.redirect('/');
		}
	},	

	/*
	* Get 10 organizations searched by name
	*/
	'search' : function(req, res, next){
		var orgName = req.param('name');

		if(orgName && orgName != ''){
			Organization.find({'name' : {'contains' : orgName}, 'accountStatus' : 1}).limit(10).exec(function(err, orgs){
				if(err){
					return next(err);
				}

				res.send(orgs);
			});
		}
	},

	/*
	* Enable an organization account
	*/
	'enable/account' : function(req, res, next){
		if(req.session && req.session.User.rol > 1){
			Organization.findOne(req.param('id'), function foundOrganization(err, organization){
				if(err) return next(err);

				if(!organization) return next();

				organization.accountStatus = 1;
				organization.save();

				req.session.flash = {
					success: "Cuenta activada con éxito"
				}

				res.redirect('/admin/organizations');
			});
		}
	},

	/*
	* Disable an organization account
	*/
	'disable/account' : function(req, res, next){
		if(req.session && req.session.User.rol > 1){
			Organization.findOne(req.param('id'), function foundOrganization(err, organization){
				if(err) return next(err);

				if(!organization) return next();

				organization.accountStatus = 0;
				organization.save();

				req.session.flash = {
					success: "Cuenta desactivada con éxito"
				}

				res.redirect('/admin/organizations');
			});
		}
	},

	/**
	* Edit the social networks links from an organization
	*/
	'editsocial' : function(req, res, next){
		if(req.session && req.session.User.rol >= 1){
			Organization.findOne(req.session.User.id, function foundOrganization(err, organization){
				if(err) return next(err);

				if(!organization) return next();

				var facebook = req.param('facebook');
				var twitter = req.param('twitter');
				var googleplus = req.param('googleplus');

				organization.facebook = facebook ? facebook : undefined;
				organization.twitter = twitter ? twitter : undefined;
				organization.googleplus = googleplus ? googleplus : undefined;

				organization.save();

				req.session.flash = {
					success: "Redes sociales editadas correctamente."
				}

				res.redirect('/organization/view?id='+organization.id);
			});
		}else{
			res.redirect('/');
		}
	},

	/**
	* Edit the social networks links from an organization
	*/
	'viewall' : function(req, res, next){
		Organization.find({'accountStatus' : 1}).exec(function organizationList(err, organizations){
			console.log(organizations);
			res.view({'organizations' : organizations});
		});
	}
};

