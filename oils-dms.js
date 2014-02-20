

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
  app.dms.docTypes = ['folder', 'file'];
  app.dms.conf = pkg.oils;
  
  self.routes[context] = function(req, res) {
    res.redirect(context + '/document/list');
  }
  self.routes[context + '/document/list'] = require('./controllers/document/list.js')(pkg, app);
  self.routes[context + '/document/add'] = require('./controllers/document/add.js')(pkg, app);
  self.routes[context + '/document/edit/:FILE_ID'] = require('./controllers/document/add.js')(pkg, app);
  self.routes[context + '/document/delete/:DOC_ID'] = require('./controllers/document/delete.js')(pkg, app);

  app.dms.utils.initDocRoutes(self.routes);
}

