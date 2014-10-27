/**
 * SessionControllerController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SessionControllerController)
   */
  _config: {},

  /**
   * Create a login session
   * @param array req
   * @param array res
   * @param function next
   * @return void
   */
  'create' : function(req, res, next){

  	if(!req.param('email') || !req.param('password')){
  		req.session.flash = {
  			err : [{name: 'userEmailPasswordRequired', message: 'Debe introducir un email y contraseña válidos.'}]
  		}
  		
  		res.redirect('/');
  		return;
  	}
  	
  	User.findOneByEmail(req.param('email')).exec(function(err, user){
  		if(err) return next(err);

  		if(!user){
  			req.session.flash = {
  				err : [{name: 'userNotFound', message: 'El email introducido no se encuentra registrado.'}]
  			}

  			res.redirect('/');
  			return;
  		}

  		require('bcrypt').compare(req.param('password'), user.password, function(err, valid){
  			if(!valid){
  				req.session.flash = {
  					err : [{name: 'invalidPassword', message: 'La contraseña introducida no es correcta.'}]
  				}

  				res.redirect('/');
  				return;
  			}

  			req.session.flash = {
       	 		success: "Hola "+user.name+", acabas de iniciar sesión correctamente."
        	}

  			req.session.authenticated = true;
  			req.session.User = user;

  			res.redirect('/');
  			return;
  		});
  	});
  },

  /**
   * Destroy a login session
   * @param array req
   * @param array res
   * @param function next
   */
  'destroy' : function(req, res, next){
    req.session.destroy();

    res.redirect('/'); 
  }
  
};
