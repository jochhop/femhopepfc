/**
 * LocationController
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
 var fs = require('fs'),
  dist = require('geo-distance-js');

module.exports = {

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {},

  /*
  * Render the view with the locations collection
  */
  'index' : function(req, res){
    res.view();
  },

  /**
  * Import location database from a xml file
  */
  //data imported, uncomment for import again
   // 'import' :  function(req, res){
   // 	var fs = require('fs'),
   //    xml2js = require('xml2js');

   //  var parser = new xml2js.Parser();
   //  fs.readFile(__dirname + '/bbdd.xml', function(err, data) {
   //       parser.parseString(data, function (err, result) {
   //           console.log('Importing data...');
   //           // console.dir(result);
   //           var countryname = 'spain';
   //           result.spain.provincia.forEach(function(province) {
   //               var countyname = province['$'].nombre;
   //               province['codigo-postal'].forEach(function(pcode){
   //                   var pcodevalue = pcode['$'].value;
   //                   pcode.municipio.forEach(function(town){
   //                     var cityname = town['$'].nombre;
   //                     console.log(cityname);
   //                     if(pcode.calle){
   //                       pcode.calle.forEach(function(street){
   //                         var streetname = street['$'].nombre;
   //                         // console.log(streetname);
   //                         Location.create({
   //                           country : countryname,
   //                           county : countyname,
   //                           city : cityname,
   //                           postalCode : pcodevalue,
   //                           street : streetname
   //                         }, function locationCreated(err, location){
   //                            if(err) {
   //                              console.log("Error: "+err);
   //                              return next(err);
   //                            }
   //                            console.log('Location created1: '+location.street);
   //                         });
   //                       });
   //                     }else{
   //                       Location.create({
   //                           country : countryname,
   //                           county : countyname,
   //                           city : cityname,
   //                           postalCode : pcodevalue
   //                         }, function locationCreated(err, location){
   //                             if(err) {
   //                              console.log("Error: "+err);
   //                              return next(err);
   //                            }
   //                            console.log('Location created2: '+location.street);
   //                         });
   //                     }
   //                   });
   //               });
   //           });
   //           //console.dir(result.spain.provincia[0]['codigo-postal']);
   //           console.log('Done');
   //       });
   //   });
   // },
  // 'test' : function(req, res){
  //   var gmaps = require('googlemaps'), util = require('util');
  //   var completAddress = "Cristóbal Colón 89, Torredonjimeno, Jaén, España, 23650";
  //   gmaps.geocode(completAddress, function(err, data){
  //     console.log(util.puts(JSON.stringify(data)));
  //     console.log("Parsing: %j",data["results"][0]["geometry"]["location"]["lat"]);
  //     console.log("Parsing: %j",data["results"][0]["geometry"]["location"]["lng"]);
  //   });
  // },

  'getcounties' : function(req, res){
    var pCode = req.param('pcode');
    Location.find({postalCode:pCode},{county:1}).exec(function(err, counties){
      if(err){
        res.send(err);
        return;
      }else{
        var temp=new Array();
        counties.sort();
        for(var i=0;i<counties.length;i++){
          if(counties[i+1] && counties[i]['county']==counties[i+1]['county']) {
            continue
          }
          temp[temp.length]=counties[i]['county'];          
        }
        //console.log(temp);
        res.send(temp);
      }
    });
  },

  'getcities' : function(req, res){
    var pCode = req.param('pcode');
    Location.find({postalCode:pCode},{city:1}).exec(function(err, cities){
      if(err){
        res.send(err);
        return;
      }else{
        var temp=new Array();
        cities.sort();
        for(var i=0;i<cities.length;i++){
          if(cities[i+1] && cities[i]['city']==cities[i+1]['city']) {
            continue
          }
          temp[temp.length]=cities[i]['city'];          
        }
        //console.log(temp);
        res.send(temp);
      }
    });
  },

  /**
  * Get the 10 closests organizations respecting the position of the user
  * if not logged or the coordinates of the user addres if logged
  */
  'closest-organizations' : function(req, res){
    var latitude = '';
    var longitude = '';

    if(req.session.User && req.session.User.rol == 0){
      latitude = req.session.User.latitude;
      longitude = req.session.User.longitude;
    }else{
      latitude = req.param('latitude') ? req.param('latitude') : '';
      longitude = req.param('longitude') ? req.param('longitude') : '';
    }

    if(latitude != '' && longitude != ''){
      Organization.find(function(err, organizations){
        var orgNumber = organizations.length;
        var orgList = [];
        var counter = 0;

        organizations.forEach(function(organization, i){
          var from = {'lng' : longitude, 'lat' : latitude};
          var to = [{'lng' : organization.longitude, 'lat' : organization.latitude}];
          var distance = dist.getDistance(from, to);
          orgList[counter] = {'organization' : organization, 'distance' : distance[0].distance};
          ++counter;
        });
        
        orgList.sort(function(a,b) { return parseFloat(a.distance) - parseFloat(b.distance) });
        var tenOrgs = orgList.slice(0,9);
        res.send({'status' : 'ok', 'orgs' : tenOrgs, 'latitude' : latitude, 'longitude' : longitude});
      });
    }else{
      res.send({'status' : 'error'});
    }
  }
  /*,
  Couldn't get all the streets from all the towns and cities, user will write it
  'getstreets' : function(req, res){
    var pCode = req.param('pcode');
    var pCity = req.param('city');
    console.log('Postal code: '+pCode);
    console.log('city: '+pCity);
    Location.find({postalCode:pCode, city:pCity},{street:1}).exec(function(err, streets){
      if(err){
        res.send(err);
        return;
      }else{
        var temp=new Array();
        streets.sort();
        for(var i=0;i<streets.length;i++){
          console.dir(streets[i]);
          if(streets[i+1] && streets[i]['street']==streets[i+1]['street']) {
            continue
          }
          temp[temp.length]=streets[i]['street'];          
        }
        //console.log(temp);
        res.send(temp);
      }
    });
  }*/
};
