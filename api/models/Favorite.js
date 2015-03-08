/**
 * Favorite
 *
 * @module      :: Model
 * @description :: Favorite object which represents the favorites organizations for the users on the app.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  
  schema: true,

  attributes: {

    idUser : {
      type: 'string',
      required: true
    },

    idOrganization : {
      type: 'string',
      required: true
    }
      
  }

};
