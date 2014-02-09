

module.exports = function(pkg, app) {
  var self = this;
  
  var context = pkg.oils.context;
  if (!context) {
    throw new Error('oils.context is not defined in package.json.');
  }
  
  self.routes = {
  }

  self.routes[context] = require('./controllers/index.js')(pkg, app);


}

