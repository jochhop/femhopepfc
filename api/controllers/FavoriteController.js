/**
 * FavoriteController
 *
 * @description :: Server-side logic for managing favorites
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/**
	* Adds an organization to user favorites
	*/
	'add' :  function(req, res){
		var idUser = req.param('idUser');
		var idOrganization = req.param('idOrganization');

		if(typeof(idUser) !== 'undefined' && typeof(idOrganization) !== 'undefined'){
			if(req.session.User && req.session.User.id == idUser){
				Organization.findOne(idOrganization, function foundOrganization(err, organization){
					if(err) return next(err);

					if(!organization) return next();

					Favorite.findOne({'idUser' : idUser, 'idOrganization' : idOrganization}, function(err, favorite){

						if(favorite){
							req.session.flash = {
								error: "La organización ya está en favoritos."
							}
						}else{
							Favorite.create({
								'idUser' : idUser,
								'idOrganization' : idOrganization
							}, function favoriteCreated(err, favorite){

								if(favorite){
									req.session.flash = {
										success: "Organización añadida a favoritos correctamente."
									}
								}else{
									req.session.flash = {
										error: "La organización no se ha podido añadir a favoritos."
									}
								}

							});
						}
					});
				});
			}

			res.redirect('/organization/view?id='+idOrganization);
			return;
		}

		res.redirect('/');
	},

	/**
	* Removes a favorite action
	*/
	'remove' : function(req, res){
		var idUser = req.param('idUser');
		var idOrganization = req.param('idOrganization');

		if(typeof(idUser) !== 'undefined' && typeof(idOrganization) !== 'undefined'){
			
			if(req.session.User && req.session.User.id == idUser || req.session.User.rol == 2 ){

				Favorite.destroy({'idUser' : idUser, 'idOrganization' : idOrganization}).exec(function(err){

					if(err){
						return next(err);
					}else{
						req.session.flash = {
							success: "Organización eliminada de favoritos correctamente."
						}
					}
				});

			}

			backURL = req.header('Referer') || '/';
			res.redirect(backURL);
			return;
		}

		res.redirect('/');
	}
};

