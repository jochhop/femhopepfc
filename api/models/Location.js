/**
 * Location
 *
 * @module      :: Model
 * @description :: Location object which represents the adress of the users, organizations, etc.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	country : {
  		type: 'string'
  	},

  	county : {
  		type: 'string'
  	},

  	city : {
  		type: 'string'
  	},

  	postalCode : {
  		type: 'string'
  	},

  	street : {
  		type: 'string'
  	}

  }

};
