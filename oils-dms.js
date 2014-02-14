

module.exports = function(pkg, app) {
  var self = this;
  app.dms = new Object();

  var context = pkg.oils.context;
  if (!context) {
    throw new Error('oils.context is not defined in package.json.');
  }
  
  self.routes = {
  }

  var DmsUtils = require('./utils/DmsUtils');
  app.dms.utils = new DmsUtils(pkg, app);

  self.routes[context + '/document/list'] = require('./controllers/document/list.js')(pkg, app);
  self.routes[context + '/document/add'] = require('./controllers/document/add.js')(pkg, app);


}

