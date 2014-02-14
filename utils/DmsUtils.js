module.exports = function(pkg, app) {
  var self = this;

  var mongoose = include('/node_modules/oils/node_modules/mongoose');
  var Document = includeModel(pkg.oils.models.document);

  self.handleFolder = function(parentFolderId, req, res, callback) {
    if (parentFolderId) {
      try {
        parentFolderId = mongoose.Types.ObjectId(parentFolderId)
      } catch(e) {
        redirectToMainWithError(req, res, 'Invalid folder.');
        return;
      }
      
    }
    Document.findOne({_id: parentFolderId}, function(err, folder) {
      if (parentFolderId) {
        if (!folder) {
          redirectToMainWithError(req, res, 'Folder not found.');
          return
        }
      }
      if (!folder) {
        //create a dummy for root folder
        folder = new Document();
        folder._id = null;
      }
      callback(err, folder);

    })

    
  }


  var redirectToMainWithError = function(req, res, error) {
    req.flash('error', error);
    res.redirect(pkg.oils.context);
  }
}
/*
var mongoose = include('/node_modules/oils/node_modules/mongoose');
var Document = includeModel(pkg.oils.models.document);

exports.createObjParams = function(pkg, app, req, res) {
  var objs = new Object();
  objs.app = app;
  objs.pkg = pkg;
  objs.req = req;
  objs.res = res;
}

exports.handleFolder = function(parentFolderId, objs, callback) {
  if (parentFolderId) {
    try {
      parentFolderId = mongoose.Types.ObjectId(parentFolderId)
    } catch(e) {
      redirectToMainWithError(req, res, 'Folder not found.');
      return;
    }
    
  }
  Document.findOne({_id: parentFolderId}, function(err, parentDoc) {
    if (parentFolderId) {
      if (!parentDoc) {
        redirectToMainWithError(req, res, 'Folder not found.');
        return
      }
    }

    callback(err, folder);

  })
}
*/
