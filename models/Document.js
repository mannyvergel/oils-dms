var mongoose = include('/node_modules/oils/node_modules/mongoose');
var Schema = mongoose.Schema;
module.exports = {
  name: 'oils.dms.Document',


  schema: {
    docType: {type: String},
    
    parentFolderId: {type: Schema.ObjectId, index: true},
    //absolutePath: {type: String, unique: true, index: true}
    
    name: String,
    route: String,
    content: Buffer,
    
    meta: {
      lastUpdateDt: {type: Date, default: Date.now},
      lastUpdateBy: {type: String, default: 'SYSTEM'},
      createDt: {type: Date, default: Date.now},
      createBy: {type: String, default: 'SYSTEM'}
    },

    //auto fields
    isFolder: Boolean, //need to store for sorting, type == 'Folder'
    lowerCaseName: {type: String, lowercase: true},
  },

  options: {
    strict: false
  },

  initSchema: function(schema){
    schema.index({parentFolderId: 1, lowerCaseName: 1}, {unique: true});
    schema.pre('save', function(next) {
      this.isFolder = (this.docType == 'Folder');
      this.lowerCaseName = this.name.toLowerCase();
      next();
    })
  }
} 