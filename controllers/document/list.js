module.exports = function(pkg, app) {
  var Document = includeModel(pkg.oils.models.document);

  return {
    get: function(req, res) {
      
      app.dms.utils.handleFolder(req.query.folderId, req, res, function(err, folder) {
        var page = req.query.p || '1';
        var numberOfRecordsPerPage = pkg.oils.numberOfRecordsPerPage;

        var skip = (page - 1) * numberOfRecordsPerPage;
        Document.find({parentFolderId: folder._id}, '', {lean: true, skip: skip, sort:{isFolder: -1}}, function(err, documents) {
    
          if (!documents || documents.length == 0) {
            //for swig
            documents = null;
          }
         
          res.renderFile(pkg.oils.views.list, {documents: documents});
        })

      })

    }
  }
}


