/**
 * User
 *
 * @module      :: Model
 * @description :: User object tha representes the vitimcs on the app.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  
  schema: true,

  attributes: {

  	email : {
  		type: 'email',
  		required: true,
      unique: true
  	},

  	password : {
  		type: 'string',
  		required: true,
  		minLength: 8
  	},

    //0 normal user, 1 organization, 2 administrator
  	rol : {
  		type: 'integer',
  		required: true,
  		defaultsTo: 0
  	},

  	name : {
  		type: 'string',
  		required: true
  	},

  	surname : {
  		type: 'string',
  		required: true
  	},

    //0 woman, 1 man
    sex : {
      type: 'integer',
      required: true, 
      defaultsTo: 0
    },

  	avatar : {
  		type: 'string'
  	},

    number : {
      type: 'string',
      required: true
    },

  	address : {
  		type: 'string',
  		required: true
  	},

    country : {
      type: 'string',
      required: true,
      defaultsTo: 'SPAIN'
    },

    province : {
      type: 'string',
      required: true
    },

    city : {
      type: 'string',
      required: true
    },

    postalCode : {
      type: 'string',
      required: true,
      maxLength: 6,
      minLength: 5
    },

  	requiredPhone : {
  		type: 'string',
  		minLength: 9,
  		required: true
  	},

  	extraPhone : {
  		type: 'string',
  		minLength: 9
  	},

    //false not shown, true shown
  	showData : {
  		type: 'boolean',
  		required: true,
      defaultsTo: false
  	},

    //0 no active, 1 active, 2 banned
    accountStatus : {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },

  	registerDate : {
  		type: 'date',
  		required: true
  	},

  	accessDate : {
  		type: 'date',
  		required: true
  	},

    latitude : {
      type : 'float',
      required : true,
      defaultsTo : '0'
    },

    longitude : {
      type : 'float',
      required : true,
      defaultsTo : '0'
    },

    toJSON : function(){
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
    
  },

  /**
   * Validating the register form before save the user
   */
  beforeCreate : function(values, next){
    Organization.findByEmail(values.email).exec(function(err, organization){
      // Error handliorganizationIdng
      if (organization.length > 0) {
        return next({err:["La dirección de correo introducida ya se encuentra registrada. Por favor, introduzca una diferente."]});
      }else{
        User.findByEmail(values.email).exec(function(err, user){
          if (organization.length > 0) {
            return next({err:["La dirección de correo introducida ya se encuentra registrada. Por favor, introduzca una diferente."]});
          }
        });
      }
    });

    if(!values.password || values.password != values.passwordConfirmation){
      return next({err:["Las contraseñas no coinciden."]});
    }

    require('bcrypt').hash(values.password, 10, function passwordEncripted(err, password){
      if(err) return next(err);
      values.password = password;
      next();
    });
  }

};
