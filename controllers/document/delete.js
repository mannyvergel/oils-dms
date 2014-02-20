module.exports = function(pkg, app) {
  var Document = includeModel(pkg.oils.models.document);
  var context = pkg.oils.context;
  var mongoose = include('/node_modules/oils/node_modules/mongoose');
  var dmsUtils = app.dms.utils;
  var myRoutes = {

    all: function(req, res) {
      var id = mongoose.Types.ObjectId(req.params.DOC_ID);
      Document.findOne({_id: id}, function(err, doc) {
      	var folderId = '';
      	if (doc.parentFolderId) {
      		folderId = doc.parentFolderId.toString();
      	}
        if (doc) {
        	doc.remove();
        }
        req.flash('info', "Document deleted");
        res.redirect(context + '/document/list?folderId=' + folderId);
      })
    }/*,

    onError: function(req, res, err, app) {
      req.flash('error', err.message);
      res.redirect('/dms');
    }*/
  }

  

  return myRoutes;
}


