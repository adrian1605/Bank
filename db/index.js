// https://github.com/JeyDotC/articles/blob/master/EXPRESS%20WITH%20SEQUELIZE.md
var path = require('path');
var models = {};
var relationships = {};

var singleton = function singleton(){
  var Sequelize = require("sequelize");
  var sequelize = null;
  var modelsPath = path.join(process.cwd(), 'db/model');
  /*
  * Sets up the Sequelize singleton instance.
  * */
  this.setup = function (database, username, password, obj){
    if(arguments.length == 2){
      sequelize = new Sequelize(database, username);
    } else if(arguments.length == 3){
      sequelize = new Sequelize(database, username, password);
    } else if(arguments.length == 4){
      if(_.isObject(obj)) {
          obj['logging'] = log.trace.bind(log);
      }
      sequelize = new Sequelize(database, username, password, obj);
    }
    init();
    return sequelize.authenticate();
  };

  /*
  * Returns a model definition of a given entity name.
  * */
  this.model = function (name){
    return models[name];
  };

  /*
  * Returns the Sequelizer instance
  * */
  this.Seq = function (){
    return Sequelize;
  };

  function init() {

    var list = ReadDirectory(modelsPath, 'js');
    list.forEach(function(modelPath) {
      var name = modelPath.replace(".js","").split("model")[1].replace("/","").replace("\\","");
      var object = require(modelPath);
      var options = object.options || {};
      options['timestamps'] = false
      models[name] = sequelize.define(name, object.model, options);
      if(_.isObject(object['relations'])) {
        relationships[name] = object['relations'];
      }
    });
    for(var name in relationships) {
      var relation = relationships[name];
      var sourceModel = models[name];
      for(var relationType in relation) {
        for(var targetName in relation[relationType]) {
          var targetModel = models[targetName],
            opt = relation[relationType][targetName] || {};
          sourceModel[relationType](targetModel, opt);
        }
      }
    }
  }

  if(singleton.caller != singleton.getInstance){
    throw new Error("This object cannot be instanciated");
  }
};


singleton.instance = null;

singleton.getInstance = function(){
  if(this.instance === null){
    this.instance = new singleton();
  }
  return this.instance;
};

module.exports = global.db = singleton.getInstance();
