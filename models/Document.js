var mongoose = include('/node_modules/oils/node_modules/mongoose');
var Schema = mongoose.Schema;
module.exports = {
  name: 'oils.dms.Document',


  schema: {
    docType: {type: String},
    isFolder: Boolean, //need to store for sorting, type == 'Folder'
    path: {
      parentFolderId: {type: Schema.ObjectId, index: true},
      absolutePath: {type: String, unique: true, index: true}
    },
    editable: {
      name: String,
      route: String,
      content: Buffer
    },
    meta: {
      lastUpdateDt: {type: Date, default: Date.now},
      lastUpdateBy: {type: String, default: 'SYSTEM'},
      createDt: {type: Date, default: Date.now},
      createBy: {type: String, default: 'SYSTEM'}
    }
  },

  options: {
    strict: false
  }
} 


/****

{
    docType: 'file',
    isFolder: false,
    path: {
        parentFolder: '/'
    },
    editable: {
        name: 'readme.txt'
    }
}

***/