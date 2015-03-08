/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	/*
	* Render the view with the messages collection
	*/
	'index' : function(req, res){
		res.view();
	},

	/**
	* Sends a new message
	*/
	'send' : function(req, res){
		var idSender = req.param('idSender');
		var roleSender = req.param('roleSender');
		var nameSender = req.param('nameSender');
		var idReceiver = req.param('idReceiver');
		var roleReceiver = req.param('roleReceiver');
		var nameReceiver = req.param('nameReceiver');
		var message = req.param('message');
		var subject = req.param('subject');

		if(idSender != '' && roleSender != '' && idReceiver != '' && roleReceiver != '' && message != '' && subject != '' && nameSender != '' && nameReceiver != ''){

			if(req.session.User && req.session.User.id == idSender){
				var sentDate = Date();
				Message.create({
					'idSender' : idSender,
					'roleSender' : roleSender,
					'nameSender' : nameSender,
					'idReceiver' : idReceiver,
					'roleReceiver' : roleReceiver,
					'nameReceiver' : nameReceiver,
					'message' : message,
					'subject' : subject,
					'sentDate' : sentDate
				}, function messageCreate(err, message){
					if(err) return next(err);
					if(!message) return next();

					if(message){
						req.session.flash = {
							success: "Mensaje enviado con éxito."
						}

						backURL = req.header('Referer') || '/';
		            	res.redirect(backURL);
		            	return;
					}
				});

			}else{
				req.session.flash = {
					error: "No se pudo enviar el mensaje."
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
	* Marks a message as read
	*/
	'read' : function(req, res){
		var idMessage = req.param('idMessage');
		var idUser = req.param('idUser');

		if(idMessage != '' && req.session.User && req.session.User.id == idUser){

			Message.findOne(idMessage, function(err, message){
				message.isRead = true;
				message.save(function(err){
					if(err){
						res.send({'status' : 'error'});
					} else {
						Message.find({'idReceiver' : req.session.User.id, 'roleReceiver' : req.session.User.rol, 'isRead' : false}, function(err, messages){
							req.session.messageCounter = messages.length;
							res.send({'status' : 'ok', 'messagesCounter' : messages.length});
						});
					}
				});
			});

		}else{
			res.send({'status' : 'error'});
		}
	}
};

