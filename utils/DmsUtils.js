module.exports = function(pkg, app) {
  var self = this;

  var mongoose = include('/node_modules/oils/node_modules/mongoose');
  var Document = includeModel(pkg.oils.models.document);

  self.handleFolder = function(parentFolderId, req, res, callback, parentFolders) {
    if (parentFolderId) {
      try {
        parentFolderId = mongoose.Types.ObjectId(parentFolderId)
      } catch(e) {
        console.error('Folder id error: ' + parentFolderId, e);
        redirectToMainWithError(req, res, 'Invalid folder.');
        return;
      }
      
    }
    Document.findOne({_id: parentFolderId}, function(err, folder) {
      if (parentFolderId) {
        if (!folder) {
          console.error('Folder not found error: ' + parentFolderId);
          redirectToMainWithError(req, res, 'Folder not found.');
          return
        }
      }
    
      if (folder) {
        if (parentFolders == null) {
          parentFolders = [];
        }
        parentFolders.unshift(folder);
        if (folder.parentFolderId) {
          self.handleFolder(folder.parentFolderId.toString(), req, res, callback, parentFolders);
          //WARNING this will return
          return;  
        }
        
      }


      var folderId = null;
      if (parentFolders) {
        folder = parentFolders[parentFolders.length-1];
        folderId = folder._id.toString();
      }
      callback(err, folder, folderId, parentFolders); 
      
      

    })

    
  }


  var redirectToMainWithError = function(req, res, error) {
    req.flash('error', error);
    res.redirect(pkg.oils.context);
  };

  self.toObjectId = function(idStr) {
    try {
      var id = mongoose.Types.ObjectId(idStr);
      return id;
    } catch(e) {
      console.error('id error: ' + idStr, e);
    }

    return null;
  };

  self.initDocRoutes = function() {
    Document.find({route: {'$ne': null}}, '', {lean: true}, function(err, docs) {
      for (var i in docs) {
        var doc = docs[i];
        self.addDocRoute(doc);
        
      }
      
    })
  };

  self.addDocRoute = function(doc) {
    if (app.isDebug) {
      console.log('Adding DMS route: %s <--> %s', doc.route, doc.name);
    }

    app.server.get(doc.route, function(req, res) {
      //TODO: stream
      res.send(doc.content.toString('utf8'));
      res.end();
    })
  };

  self.removeDocRoute = function(doc) {
    removeRoute(doc.route);
  };

  var removeRoute = function(routeStr) {
    var routes = app.server.routes;
    for (k in routes.get) {
      if (routes.get[k].path + "" === routeStr + "") {
        routes.get.splice(k,1);
        break;
      }
    }
  };
}
