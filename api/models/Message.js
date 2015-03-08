/**
 * Message
 *
 * @module      :: Model
 * @description :: Message object which create communications in the app.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  
  schema: true,

  attributes: {

    idSender : {
      type: 'string',
      required: true
    },

    roleSender : {
      type: 'integer', 
      required: true
    },

    nameSender : {
      type: 'text', 
      required: true
    },

    idReceiver : {
      type: 'string',
      required: true
    }, 

    roleReceiver : {
      type: 'integer', 
      required: true
    }, 

    nameReceiver : {
      type: 'text', 
      required: true
    }, 

    message : {
      type: 'text', 
      required:  true 
    },

    subject : {
      type: 'string', 
      required:  true 
    },

    sentDate : {
      type: 'date',
      required: true
    }, 

    isRead : {
      type: 'boolean',
      required: true,
      defaultsTo: false
    }

  }

};