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
var fs = require('fs'),
gmaps = require('googlemaps');
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
                        error: "No se ha podido crear el usuario."
                    }                    

                    return res.redirect('/');
                }

                var completAddress = user.address+" "+user.number+","+user.country+","+user.province+","+user.city;

                gmaps.geocode(completAddress, function(err, data){
                    user.latitude = data["results"][0]["geometry"]["location"]["lat"];
                    user.longitude = data["results"][0]["geometry"]["location"]["lng"];
                    user.save();
                });

                req.session.flash = {
                    success: "Usuario creado correctamente, para acceder a su cuenta por favor, introduzca su email y su contraseña en la barra superior."
                }
            });
    });

    return res.redirect('/');
    },

    /**
    * Edit user function
    */
    // 'update' : function(req, res, next){
    //   if(req.session.User && req.session.User.id == req.param('userId')){
    //     var uploadFile = req.file('avatar');

    //     uploadFile.upload({dirname : UPLOAD_PATH}, function onUploadComplete (err, files) {                                                         

    //       if (err) return res.serverError(err);

    //       if(files.length > 0){
    //         var fileNameSplitted = files[0]['fd'].split("/");
    //         var fileName = fileNameSplitted[fileNameSplitted.length - 1];
    //       }else{
    //         var fileName = '';
    //       }

    //       User.findOne().where({id : req.param('userId')}).then(function(user){
    //         if(user){
    //           //direct params
    //           user.name = req.param('name');
    //           user.surname = req.param('surname');
    //           user.number = req.param('number');
    //           user.address = req.param('address');
    //           user.province = req.param('province');
    //           user.city = req.param('city');
    //           user.postalCode = req.param('postalCode');
    //           user.requiredPhone = req.param('requiredPhone');
    //           user.extraPhone = req.param('extraPhone');

    //           //avatar
    //           if(fileName != ''){
    //             if(user.avatar != NO_USER_PHOTO){
    //               fs.unlink('assets/images/' + user.avatar, function (err) {
    //                 if (err) throw err;
    //                 console.log('successfully deleted '+UPLOAD_PATH + '/' + user.avatar);
    //               });
    //             }
    //             user.avatar = fileName;
    //           }

    //           //show data
    //           var showData = false;
    //           if(req.param('showData') != 'undefined' && req.param('showData') == 1){
    //             showData = true;
    //           }
    //           user.showData = showData;

    //           //user saved
    //           user.save(function(err){
    //             if(err) {
    //               console.log(err);
    //               req.session.flash = {
    //                 error: "El usuario no ha podido ser editado"
    //               }
    //               res.redirect('/user/view?id='+req.param('userId'));
    //               return;
    //             }

    //             var completAddress = user.address+" "+user.number+","+user.country+","+user.province+","+user.city;

    //             gmaps.geocode(completAddress, function(err, data){
    //               user.latitude = data["results"][0]["geometry"]["location"]["lat"];
    //               user.longitude = data["results"][0]["geometry"]["location"]["lng"];
    //               user.save();
    //             });

    //             if(req.session.User.id == user.id){
    //               req.session.User = user;
    //             }
    //           });

    //           //changing password
    //           if(req.param('password') && req.param('password') != '' && req.param('password') == req.param('passwordConfirmation')){

    //             require('bcrypt').hash(req.param('password'), 10, function passwordEncripted(err, password){
    //               if(err) return next(err);

    //               user.password = password;
    //               user.passwordConfirmation = password;
    //               user.save(function(err){
    //                 if(err) return next(err);
    //               });
    //             });
    //           }
    //           res.redirect('/user/view?id='+req.param('userId'));
    //           return;
    //         }else{
    //           req.session.flash = {
    //             error: "El usuario no se ha encontrado"
    //           }
    //           res.redirect('/');
    //           return;
    //         }

    //         req.session.flash = {
    //           success: "Usuario editado correctamente, verás tus cambios aplicados cuando vuelvas a logearte"
    //         }
    //       });
    //     });
    //   }else{
    //     req.session.flash = {
    //       error: "No tienes permisos para realizar esta acción."
    //     }
    //     res.redirect('/');
    //   }
    // },

    'update' : function(req, res, next){
        var userId = req.param('userId');

        console.log("Updating user");
        if(req.session.User && req.session.User.id == userId || req.session.User && req.session.User.rol == 2){

            User.findOne().where({id : userId}).then(function(user){
                if(!user) return next("Error, user not found.");

                // avatar
                var uploadFile = req.file('avatar');

                uploadFile.upload({dirname : UPLOAD_PATH}, function onUploadComplete (err, files) {                                                         

                    if (err) return res.serverError(err);

                    if(files.length > 0){
                        var fileNameSplitted = files[0]['fd'].split("/");
                        var fileName = fileNameSplitted[fileNameSplitted.length - 1];
                    }else{
                        var fileName = '';
                    }

                    if(fileName != ''){
                        if(user.avatar != NO_USER_PHOTO){
                            fs.unlink('assets/images/' + user.avatar, function (err) {
                                if (err) throw err;
                                console.log('successfully deleted '+UPLOAD_PATH + '/' + user.avatar);
                            });
                        }
                        user.avatar = fileName;
                        user.save();
                        console.log("Avatar updated: "+fileName);
                    }

                });
                
                // changing password
                if(req.param('password') && req.param('password') != '' && req.param('password') == req.param('passwordConfirmation')){
                    require('bcrypt').hash(req.param('password'), 10, function passwordEncripted(err, password){
                        if(err) return next(err);

                        user.password = password;
                        user.passwordConfirmation = password;
                        user.save();
                        console.log("Password updated");
                    });
                }

                // address
                if(
                    user.address != req.param('address') || 
                    user.number != req.param('number') || 
                    user.city != req.param('city') || 
                    user.postalCode != req.param('postalcode') ||
                    user.province != req.param('province')
                ){
                    var completAddress = user.address+" "+user.number+","+user.country+","+user.province+","+user.city;

                    gmaps.geocode(completAddress, function(err, data){
                        user.latitude = data["results"][0]["geometry"]["location"]["lat"];
                        user.longitude = data["results"][0]["geometry"]["location"]["lng"];
                        user.number = req.param('number');
                        user.address = req.param('address');
                        user.province = req.param('province');
                        user.city = req.param('city');
                        user.postalCode = req.param('postalCode');

                        user.save();
                        console.log("Address updated: "+completAddress);
                    });
                }

                // show data
                var showData = false;
                
                if(req.param('showData') != 'undefined' && req.param('showData') == 1){
                    showData = true;
                }

                user.showData = showData;

                // Rest of parameters
                user.name = req.param('name');
                user.surname = req.param('surname');
                user.requiredPhone = req.param('requiredPhone');
                user.extraPhone = req.param('extraPhone');

                // saving the user
                user.save(function(err){
                    if(err) return next(err);

                    req.session.flash = {
                        success: "Usuario editado correctamente"
                    }

                    // Refreshing cache if the user is editing its own profile
                    if(req.session.User && req.session.User.id == userId){
                        req.session.User = user;
                    }

                    console.log("User updated.");

                    res.redirect('/user/view?id='+userId);
                    return;
                })
            });
        }else{
            req.session.flash = {
                error: "No tienes permisos para realizar esta acción"
            }

            res.redirect('/');
            return;
        }
    },

    /**
    * Renders the user view
    */
    'view' : function(req, res, next){
        if(req.session.User && req.session.User.rol == 2 || req.session.User.id == req.param('id')){
            User.findOne(req.param('id'), function foundUser(err, user){
                if(err) return next(err);
                if(!user) return next();
                res.view({
                    user : user
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
    * Restricted user view for the rest of the organizations
    */
    'restricted' : function(req, res, next){
        if(req.session.User && req.session.User.rol >= 1){
            User.findOne(req.param('id'), function foundUser(err, user){
                if(err) return next(err);
                if(!user) return next();
                res.view({
                    user : user
                });
            });
        }else{
            res.redirect('/');
        }
    },

    /**
    * Renders the favorites list
    */
    'favorites' : function(req, res, next){
        if(req.session.User && req.session.User.rol == 2 || req.session.User.id == req.param('id')){
            User.findOne(req.param('id'), function foundUser(err, user){
                if(err) return next(err);
                if(!user) return next();

                Favorite.find({'idUser': req.param('id')}, function foundFavorites(err, favorites){
                    if(err) return next(err);
                    if(!favorites) return next();

                    var orgFavorites = new Array();
                    var nFavorites = favorites.length;

                    for(var i = 0 ; i < nFavorites ; i++){
                        orgFavorites.push(favorites[i].idOrganization);
                    }

                    Organization.find({'id' : {'$in':orgFavorites}}, function(err, organizations){
                        if(err) return next(err);

                        res.view({
                            organizations : organizations,
                            user : user
                        });

                    });
                });
            });
        }else{
            req.session.flash = {
                error: "No tienes permisos para realizar esta acción."
            }
            res.redirect('/');
        }
    },

    /**
    * Removes a favorite
    */
    'favorites/remove' : function(req, res, next){
        if(req.session.User && req.session.User.rol == 2 || req.session.User.id == req.param('id')){
            Favorite.find({'idUser': req.param('id')}, function foundFavorites(err, favorites){
                if(err) return next(err);
                if(!favorites) return next();

                var orgFavorites = new Array();
                var nFavorites = favorites.length;

                for(var i = 0 ; i < nFavorites ; i++){
                    orgFavorites.push(favorites[i].idOrganization);
                }

                Organization.find({'id' : {'$in':orgFavorites}}, function(err, organizations){
                    if(err) return next(err);

                    res.view({
                        organizations : organizations
                    });

                });
            });
        }else{
            req.session.flash = {
                error: "No tienes permisos para realizar esta acción."
            }
            res.redirect('/');
        }
    },

    /**
    * Renders the messages list
    */
    'messages' : function(req, res, next){
        if(req.session.User && req.session.User.id == req.param('id')){
            User.findOne(req.param('id'), function foundUser(err, user){
                if(err) return next(err);
                if(!user) return next();

                Message.find({$or : [{'idSender' : req.param('id'), 'roleSender' : 0}, {'idReceiver' : req.param('id'), 'roleReceiver' : 0}]}).sort([['sentDate', 1]]).exec(function foundMessages(err, messages){
                    if(err) return next(err);
                    res.view({
                        messages : messages,
                        user : user
                    });

                });
            });
        }else{
            req.session.flash = {
                error: "No tienes permisos para realizar esta acción."
            }
            res.redirect('/');
        }
    },

    /**
    * Changes the status account to enabled
    */
    'enable/account' : function(req, res, next){
        if(req.session && req.session.User.rol > 1){
            User.findOne(req.param('id'), function foundOrganization(err, user){
                if(err) return next(err);

                if(!user) return next();

                user.accountStatus = 1;
                user.save();

                req.session.flash = {
                    success: "Cuenta activada con éxito"
                }

                res.redirect('/admin/users');
            });
        }
    },

    /**
    * Changes the status account to disabled
    */
    'disable/account' : function(req, res, next){
        if(req.session && req.session.User.rol > 1){
            User.findOne(req.param('id'), function foundOrganization(err, user){
                if(err) return next(err);

                if(!user) return next();

                user.accountStatus = 0;
                user.save();

                req.session.flash = {
                    success: "Cuenta desactivada con éxito"
                }

                res.redirect('/admin/users');
            });
        }
    }

};
