module.exports = function(pkg, app) {
  var Document = includeModel(pkg.oils.models.document);
  var context = pkg.oils.context;
  var mongoose = include('/node_modules/oils/node_modules/mongoose');
  return {
    get: function(req, res) {
      
      app.dms.utils.handleFolder(req.query.folderId, req, res, function(err, folder, folderId, parentFolders) {
        folderId = folderId || '';

        
        
        var fileId = req.params.FILE_ID;
        if (fileId) {
          fileId = mongoose.Types.ObjectId(fileId)
          Document.findOne({_id:fileId}, function(err, doc) {
            if (!doc) {
              req.flash('error', 'File not found.');
              res.redirect(context + '/document/list?folderId=' + folderId);
              return;
            }
            if (doc.parentFolderId) {
              folderId = doc.parentFolderId.toString();
            }
            res.renderFile(pkg.oils.views.addDocument,
            {context: context, folderId: folderId, isFolder: doc.isFolder, doc: doc});
          })
        } else {
          var doc = new Object();

          doc.docType = req.query.docType || 'File';
          res.renderFile(pkg.oils.views.addDocument, 
          {context: context, folderId: folderId, isFolder: req.query.isFolder, doc: doc});
        }
        

      })

    },

    post: function(req, res) {
      app.dms.utils.handleFolder(req.body.folderId, req, res, function(err, folder, folderId) {
        var docType = req.body.docType;
        var name = req.body.name;
        var doc = new Document();
        var updateMode = false;
        if (req.body._id) {
          updateMode = true;
          doc._id = mongoose.Types.ObjectId(req.body._id);
        }
        //var editables = doc.toObject({minimize: false, getters: true}).editable;

        for (var i in app.dms.conf.editables) {
          var editable = app.dms.conf.editables[i];
          var name = editable.name;
          
          if (editable.type == "file") {
            var content = req.body[name];
            if (content) {
              doc[name] = new Buffer(req.body[name], "utf8");
            }
            
            //console.log('SAVEF BUFFER: ' + req.body[name])
          } else {
            doc[name] = req.body[name];
          }
          //console.log('!!!'+  i);
        }

        if (docType == 'Folder') {
          doc.isFolder = true;
        }

        doc.docType = docType;
        if (folder) {
          doc.parentFolderId = folder._id;
        }
        if (updateMode) {
          var docData = doc.toObject();
          delete docData._id;
          Document.update({_id:doc._id}, docData, function(err) {
            if (err) {
              console.error('Error saving doc', err);
            }
          })
        } else {
          doc.save(function(err) {
            if (err) {
              console.error('Error saving doc', err);
            }
          })
        }
        

        req.flash('info', name + ' created successfully.');
        folderId = folderId || '';
        res.redirect(context + '/document/list?folderId=' + folderId);
      })  
    }
  }
}


