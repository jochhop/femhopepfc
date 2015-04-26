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
        Organization.findOneByEmail(req.param('email')).exec(function(err, organization){
          if(!organization){
      			req.session.flash = {
      				err : [{name: 'userNotFound', message: 'El email introducido no se encuentra registrado.'}]
      			}

      			res.redirect('/');
      			return;
          }

          require('bcrypt').compare(req.param('password'), organization.password, function(err, valid){
            if(!valid){
              req.session.flash = {
                err : [{name: 'invalidPassword', message: 'La contraseña introducida no es correcta.'}]
              }

              res.redirect('/');
              return;
            }

            req.session.authenticated = true;
            req.session.User = organization;

            req.session.flash = {
              success: "Hola "+organization.name+", acabas de iniciar sesión correctamente."
            }

            Message.find({'idReceiver' : organization.id, 'roleReceiver' : organization.rol, 'isRead' : false}, function(err, messages){
              req.session.messagesCounter = messages.length;
              backURL = req.header('Referer') || '/';
              res.redirect(backURL);
              return;
            });
            
          });

        });
  		}
      if(user){
    		require('bcrypt').compare(req.param('password'), user.password, function(err, valid){
    			if(!valid){
    				req.session.flash = {
    					err : [{name: 'invalidPassword', message: 'La contraseña introducida no es correcta.'}]
    				}

    				res.redirect('/');
    				return;
    			}

    			req.session.authenticated = true;
    			req.session.User = user;
          req.session.flash = {
            success: "Hola "+user.name+", acabas de iniciar sesión correctamente."
          }

          Message.find({'idReceiver' : user.id, 'roleReceiver' : user.rol, 'isRead' : false}, function(err, messages){
            req.session.messagesCounter = messages.length;
            backURL = req.header('Referer') || '/';
            res.redirect(backURL);
            return;
          });
    		});
      }
  	});
  },

  /**
   * Create a login session for the administration
   * @param array req
   * @param array res
   * @param function next
   * @return void
   */
  'admin/create' : function(req, res, next){

    if(!req.param('email') || !req.param('password')){
      req.session.flash = {
        err : [{name: 'userEmailPasswordRequired', message: 'Debe introducir un email y contraseña válidos.'}]
      }
      
      res.redirect('/');
      return;
    }
    
    User.findOne({'email' : req.param('email'), 'rol' : 2}).exec(function(err, admin){
      if(err) return next(err);

      if(admin){
        require('bcrypt').compare(req.param('password'), admin.password, function(err, valid){
          if(!valid){
            console.log("Administrator not loged.");
            req.session.flash = {
              err : [{name: 'invalidPassword', message: 'La contraseña introducida no es correcta.'}]
            }

            res.redirect('/admin');
            return;
          }

          req.session.flash = {
            success: "Acabas de iniciar sesión como administrador."
          }

          req.session.authenticated = true;
          req.session.User = admin;
          
          console.log("Administrator not loged.");

          res.redirect('/admin');
          return;
        });
      }else{
        console.log("Not admin found.");

        req.session.flash = {
          err : [{name: 'errorAdminData', message: 'Acceso denegado.'}]
        }

        res.redirect('/admin');
        return;
      }
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
