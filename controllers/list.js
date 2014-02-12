
var mongoose = include('/node_modules/oils/node_modules/mongoose');
module.exports = function(pkg, app) {
  var Document = includeModel(pkg.oils.models.document);

  return {
    get: function(req, res) {
      var params = {};
      var folder = req.query.folder;
      if (folder) {
        params['path.parentFolder'] = folder;
      } else {
        var folderId = req.query.folderId;
        if (folderId) {
          folderId = mongoose.Types.ObjectId(folderId);
        }
        
        params['path.parentFolderId'] = folderId;
      }
      var page = req.query.p || '1';
      var numberOfRecordsPerPage = pkg.oils.numberOfRecordsPerPage;

      var skip = (page - 1) * numberOfRecordsPerPage;
      Document.find(params, '', {lean: true, skip: skip, sort:{isFolder: -1}}, function(err, documents) {
  
        if (!documents || documents.length == 0) {
          //for swig
          documents = null;
        }
        //console.log('!!!' + JSON.stringify(documents))
        res.renderFile(pkg.oils.views.list, {documents: documents});
      })
      
    }
  }
}
  