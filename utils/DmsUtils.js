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

  self.mkdirs = function(path, callback) {
    var arrFolders = path.substr(1).split('/');
    //console.log('!' + arrFolders);
    _mkdirs(arrFolders, callback, 0);
   
  };

  var _mkdirs = function(arrFolders, callback, index, parentFolderId) {
    var folderName = arrFolders[index];
    //console.log('ZZZ!!!' + folderName);
    Document.findOne({parentFolderId: parentFolderId, lowerCaseName: folderName.toLowerCase()}, function(err, doc) {
      if (!doc) {
        doc = new Document();
        doc.name = folderName;
        
        doc.parentFolderId = parentFolderId;
        doc.docType = 'Folder';
        doc.save(function(err) {
          if (err) {
            console.error(err);
          } else {
            _handleMkdirsCallback(doc, arrFolders, callback, index, parentFolderId);
          }
        });
      } else {
        _handleMkdirsCallback(doc, arrFolders, callback, index, parentFolderId);
      }
      
    })
  };

  var _handleMkdirsCallback = function(doc, arrFolders, callback, index, parentFolderId) {
    index++;
    if (index < arrFolders.length) {
      _mkdirs(arrFolders, callback, index, doc._id);
    } else {
      callback(null, doc);
    }
  }
}
