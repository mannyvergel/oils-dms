module.exports = function(pkg, app) {
  var Document = includeModel(pkg.oils.models.document);

  return {
    get: function(req, res) {
      
      app.dms.utils.handleFolder(req.query.folderId, req, res, function(err, folder) {
        var context = pkg.oils.context;
        var editables = (new Document()).toObject({minimize: false, getters: true}).editable;
     
        res.renderFile(pkg.oils.views.addDocument, {context: context, folder: folder, editables: editables});

      })

    }
  }
}


