/**
 * UserController
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
/* modules required */
 var fs = require('fs');
/* path for upload the images */
var UPLOAD_PATH = '../../assets/images';
var NO_USER_PHOTO = 'no_image.png';

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

  /*
  * Render the view with the users collection
  */
  'index' : function(req, res){
    res.view();
  },

  /**
  * Render a view for add a new user
  */
  'register' :  function(req, res){
    if(req.session.User){
      res.redirect('/user/view?id:'+req.session.User.id);
    }else{
      res.view();
    }
  },

  /**
  * Create new user action
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
  },

  /**
  * Edit user data
  */
  'update' : function(req, res, next){
    var uploadFile = req.file('avatar');

    uploadFile.upload({dirname : UPLOAD_PATH}, function onUploadComplete (err, files) {                                                         
        
      if (err) return res.serverError(err);

      if(files.length > 0){
        var fileNameSplitted = files[0]['fd'].split("/");
        var fileName = fileNameSplitted[fileNameSplitted.length - 1];
      }else{
        var fileName = '';
      }

      User.update(
      req.param('userId'),
      {
        name : req.param('name'),
        surname : req.param('surname'),
        number : req.param('number'),
        address : req.param('address'),
        province : req.param('province'),
        city : req.param('city'),
        postalCode : req.param('postalCode'),
        requiredPhone : req.param('requiredPhone'),
        extraPhone : req.param('extraPhone'),
        showDaata : req.param('showData')
      }, function userUpdated(err, user){

        if(err) {
          console.log(err);

          req.session.flash = {
            err: err
          }                    

          return res.redirect('/');
        }else{
          
          if(req.param('password') != '' && req.param('password') == req.param('passwordConfirmation')){
            
            require('bcrypt').hash(req.param('password'), 10, function passwordEncripted(err, password){
              if(err) return next(err);

              if(fileName != ''){
                if(user.avatar != NO_USER_PHOTO){
                  fs.unlink(UPLOAD_PATH + '/' + user.avatar, function (err) {
                    if (err) throw err;
                    console.log('successfully deleted '+UPLOAD_PATH + '/' + user.avatar);
                  });
                }
                user.avatar = fileName;
              }

              user.password = password;
              user.passwordConfirmation = passwordConfirmation;
              user.save();
              // User.update(req.param('userId'),
              // {
              //   password : password,
              //   passwordConfirmation : password
              // }, function userUpdated(err, user){
              //   console.log(user);
              //   req.session.User = user;
              //   if(err) {
              //     console.log(err);

              //     req.session.flash = {
              //       err: err
              //     }                    

              //     return res.redirect('/');
              //   }
              // });

            });

          }
        }
        
        req.session.flash = {
          success: "Usuario editado correctamente"
        }
        res.redirect('/user/view?id:'+req.param('userId'));
      });
    });
  },
 
  /**
  * Render the user view
  */
  'view' : function(req, res, next){
    if(req.session.User && req.session.User.rol == 2){
      User.findOne(req.param('id'), function foundUser(err, user){
        if(err) return next(err);
        if(!user) return next();
        res.view({
          user : user
        });
      });
    }else{
      User.findOne(req.session.User.id, function foundUser(err, user){
        if(err) return next(err);
        if(!user) return next();
        res.view({
          user : user
        });
      });
    }
  }
  
};
