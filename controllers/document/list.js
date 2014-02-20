module.exports = function(pkg, app) {
  var Document = includeModel(pkg.oils.models.document);
  var context = pkg.oils.context;
  return {
    get: function(req, res) {
      app.dms.utils.handleFolder(req.query.folderId, req, res, function(err, folder, folderId, parentFolders) {
        var page = req.query.p || '1';
        var numberOfRecordsPerPage = pkg.oils.numberOfRecordsPerPage;

        var skip = (page - 1) * numberOfRecordsPerPage;
        
        Document.find({'parentFolderId': folderId}, '', {lean: true, skip: skip, sort:{isFolder: -1, name: 1}}, function(err, documents) {
    
          if (!documents || documents.length == 0) {
            //for swig
            documents = null;
          }
          folderId = folderId || '';
          res.renderFile(pkg.oils.views.list, {documents: documents, context: context, folderId: folderId, parentFolders: parentFolders});
        })

      })

    }
  }
}


