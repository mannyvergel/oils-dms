

module.exports = function(pkg, app) {
  var Document = includeModel(pkg.oils.documentModel);

  return {
    get: function(req, res) {
      var page = req.query.p || '1';
      var numberOfRecordsPerPage = pkg.oils.numberOfRecordsPerPage;

      var skip = (page - 1) * numberOfRecordsPerPage;
      Document.find({'path.parentFolder': '/'}, '', {lean: true, skip: skip}, function(err, documents) {

      })
      res.end('HELLO WORLD');
    }
  }
}
  