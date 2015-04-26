/**
 * ReportController
 *
 * @description :: Server-side logic for managing reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/*
	* Renders the view with the reports collection
	*/
	'index' : function(req, res){
		res.view();
	},

	/**
	* Sends a new report
	*/
	'send' : function(req, res, next){
		var idSender = req.param('idSender');
		var roleSender = req.param('roleSender');
		var nameSender = req.param('nameSender');
		var idReceiver = req.param('idReceiver');
		var roleReceiver = req.param('roleReceiver');
		var nameReceiver = req.param('nameReceiver');
		var message = req.param('message');
		var subject = req.param('subject');

		if(idSender != '' && roleSender != '' && message != '' && subject != '' && nameSender != ''){

			if(req.session.User && req.session.User.id == idSender){
				var sentDate = Date();
				Message.create({
					'idSender' : idSender,
					'roleSender' : roleSender,
					'nameSender' : nameSender,
					'idReceiver' : idReceiver,
					'roleReceiver' : roleReceiver,
					'nameReceiver' : nameReceiver,
					'isReport' : true,
					'message' : message,
					'subject' : subject,
					'sentDate' : sentDate
				}, function reportCreate(err, report){
					if(err) return next(err);
					if(!report) return next();

					if(report){
						req.session.flash = {
							success: "Reporte enviado con éxito."
						}

						backURL = req.header('Referer') || '/';
		            	res.redirect(backURL);
		            	return;
					}
				});

			}else{
				req.session.flash = {
					error: "No se pudo enviar el reporte."
				}

				backURL = req.header('Referer') || '/';
            	res.redirect(backURL);
            	return;
			}

		}else{
			req.session.flash = {
				error: "Por favor rellene todos los campos del formulario."
			}

			backURL = req.header('Referer') || '/';
            res.redirect(backURL);
            return;
		}
	},

	/**
	* Marks a report as read
	*/
	'read' : function(req, res){
		var idMessage = req.param('idMessage');
		var idUser = req.param('idUser');

		if(idMessage != '' && req.session.User && req.session.User.rol == 2){

			Message.findOne(idMessage, function(err, report){
				report.isRead = true;
				report.save(function(err){
					if(err){
						return res.send({'status' : 'error'});
					}
				});
			});

		}else{
			res.send({'status' : 'error'});
		}
	},
};

