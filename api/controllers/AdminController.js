/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
  /* modules required */
var fs = require('fs'),
util = require('util'),
gmaps = require('googlemaps');

module.exports = {
	
	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to UserController)
	*/
	_config: {},

	/*
	* Redirect to the login page if there is no admin logged or to users list if else
	*/
	'index' : function(req, res){
		if(req.session.User && req.session.User.rol > 1){
			return res.redirect('/admin/users');
		}else{
			res.view('admin/index', { layout: 'layoutadmin' });
		}
	},

	/*
	* Load all the users for the administration
	*/
	'users' : function(req, res, next){

		if(req.session.User && req.session.User.rol > 1){
			User.find({'rol' : 0}).exec(function(err, users){
				if(err){
					return next(err);
				}

				res.view('admin/users', { layout : 'layoutadmin', users : users });
			});
		}else{
			res.redirect('/');
		}
	},

	/*
	* Load all the users for the administration
	*/
	'organizations' : function(req, res, next){

		if(req.session.User && req.session.User.rol > 1){
			Organization.find().exec(function(err, organizations){
				if(err){
					return next(err);
				}

				res.view('admin/organizations', { layout : 'layoutadmin', organizations : organizations });
			});
		}else{
			res.redirect('/');
		}
	},

	/**
	* Create a new admin, used only once
	*/
	// 'create' : function(req, res, next){
	// 	var todayDate = Date();
			
	// 	User.create({
	// 		email : "admin@admin.com",
	// 		password : "admin123",
	// 		name : "Administrator",
	// 		surname : "Femhope",
	// 		number : "10",
	// 		address : "Plac Teatralny",
	// 		province : "Opolskie",
	// 		city : "Opole",
	// 		postalCode : "45-056",
	// 		registerDate : todayDate,
	// 		accessDate : todayDate,
	// 		passwordConfirmation : "admin123",
	// 		sex : 2,
	// 		requiredPhone : '792825506',
	// 		showData: false,
	// 		rol : 2,
	// 		accountStatus : 1
	// 	}, function adminCreated(err, admin){

	// 		if(err) {
	// 			console.log(err);

	// 			req.session.flash = {
	// 				err: err
	// 			}                    

	// 			return res.redirect('/');
	// 		}

	// 		var completAddress = admin.address+" "+admin.number+","+admin.country+","+admin.province+","+admin.city;

	// 		gmaps.geocode(completAddress, function(err, data){
	// 			admin.latitude = data["results"][0]["geometry"]["location"]["lat"];
	// 			admin.longitude = data["results"][0]["geometry"]["location"]["lng"];
	// 			admin.save();
	// 		});
			
	// 		req.session.flash = {
	// 			success: "Administrador creado correctamente."
	// 		}

	// 		console.log("Administrator created successfully.");
	// 	});
	// 	return res.redirect('/admin');
	// },

};

