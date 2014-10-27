/**
 * OrganizationController
 *
 * @description :: Server-side logic for managing Organizationcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

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
	* Create new organization action
	*/
	'create' : function(req, res, next){
		var todayDate = Date();
		var uploadFile = req.file('avatar');

		console.log(uploadFile);

		uploadFile.upload({dirname : UPLOAD_PATH}, function onUploadComplete (err, files) {                                                         
		    
		    if (err) return res.serverError(err);
		    
		    var fileNameSplitted = files[0]['fd'].split("/");
		    var fileName = fileNameSplitted[fileNameSplitted.length - 1];
		    console.log(fileName);
		    
		    User.create({
		      email : req.param('email'),
		      password : req.param('password'),
		      name : req.param('name'),
		      surname : req.param('surname'),
		      sex : req.param('sex'),
		      avatar : fileName,
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
		    }, function userCreated(err, user){

		        if(err) {
		          console.log(err);

		          req.session.flash = {
		            err: err
		          }                    

		          return res.redirect('/');
		        
		        }

		        req.session.flash = {
		            success: "Usuario creado correctamente, para acceder a su cuenta por favor, introduzca su email y su contraseña en la barra superior."
		        }
		    });
		});

		return res.redirect('/');
	}

};

