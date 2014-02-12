
var mongoose = include('/node_modules/oils/node_modules/mongoose');
var async = require('async');
module.exports = function(pkg, app) {
  var Document = includeModel(pkg.oils.models.document);

  return {
    get: function(req, res) {

      async.series([funciton(callback) {
        var result = new Object();
        var docParams = new Object();
        result.docParams = paradocParamsms;
        result.params = new Object();
        var folder = req.query.folder;
        if (folder) {
          docParams['path.parentFolder'] = folder;
          callback(null, docParams);
        } else {
          var folderId = req.query.folderId;
          if (folderId) {
            folderId = mongoose.Types.ObjectId(folderId);
            Document.findOne({_id: folderId}, function(err, doc) {
              if (!doc) {
                req.flash('error', 'Folder not found'); 
              } else {
                docParams['path.parentFolderId'] = folderId;
              }

              callback(null, docParams);
            })
          } else {
            callback();
          }
          
          
        }
      }],
        function(err, results) {
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
        })
      
      
      
    }
  }
}
  