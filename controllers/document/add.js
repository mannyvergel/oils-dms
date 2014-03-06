module.exports = function(pkg, app) {
  var Document = includeModel(pkg.oils.models.document);
  var context = pkg.oils.context;
  var mongoose = include('/node_modules/oils/node_modules/mongoose');
  var dmsUtils = app.dms.utils;
  var myRoutes = {
    get: function(req, res) {

      dmsUtils.handleFolder(req.query.folderId, req, res, function(err, folder, folderId, parentFolders) {
        folderId = folderId || '';

        
        
        var fileId = req.params.FILE_ID;
        if (fileId) {
          fileId = dmsUtils.toObjectId(fileId);
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
      dmsUtils.handleFolder(req.body.folderId, req, res, function(err, folder, folderId) {
        
        

        if (req.body._id) {
          //updateMode = true;
          var id = mongoose.Types.ObjectId(req.body._id);
          Document.findOne({_id: id}, function(err, doc) {
            if (doc) {
              handleDocSave(req, res, doc, folder, true);
            }
          })
        } else {
          var doc = new Document();
          handleDocSave(req, res, doc, folder, false);
        }


        
      })  
    }/*,

    onError: function(req, res, err, app) {
      req.flash('error', err.message);
      res.redirect('/dms');
    }*/
  }

  var handleDocSave = function(req, res, doc, folder, updateMode) {
        var docType = req.body.docType;
        var name = req.body.name;
        if (docType == 'Folder') {
          doc.isFolder = true;
        }
        for (var i in app.dms.conf.editables) {
          var editable = app.dms.conf.editables[i];
          var name = editable.name;
          var content = req.body[name];
          if (content) {
            if (editable.type == "file") {
              doc[name] = new Buffer(content, "utf8");
              //console.log('SAVEF BUFFER: ' + req.body[name])
            } else {
              doc[name] = content;
            }
          } else {
            if (editable.required) {
              req.flash('error', editable.name + ' is required.');
              if (updateMode) {
                res.redirect(context + '/document/edit/' + req.body._id);
              } else {
                var isFolder = '';
                
                if (doc.isFolder) {
                  isFolder = 'y';
                }
                res.redirect(context + '/document/add?isFolder=' + isFolder);
              }
              
              return;
            }
            doc[name] = null;
          }
          //console.log('!!!'+  i);
        } 

        

        doc.docType = docType;
        if (folder) {
          doc.parentFolderId = folder._id;
        }
        // if (updateMode) {
        //   var docData = doc.toObject();
        //   delete docData._id;
        //   Document.update({_id:doc._id}, docData, function(err) {
        //     if (err) {
        //       console.error('Error saving doc', err);
        //     }
        //   })
        // } else {
        //   doc.save(function(err) {
        //     if (err) {
        //       console.error('Error saving doc', err);
        //     }
        //   })
        // }

        doc.save(function(err) {
            if (err) {
              console.error('Error saving doc', err);
              req.flash('error', 'Error saving document.');
            } else {
              req.flash('info', doc.name + ' created successfully.');
            }


            var folderId = doc.parentFolderId || '';
            res.redirect(context + '/document/list?folderId=' + folderId);
          })
        

        
  }

  return myRoutes;
}


