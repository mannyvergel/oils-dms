module.exports = {
  name: 'oils.dms.Document',


  schema: {
    docType: {type: String},
    isFolder: Boolean, //need to store for sorting, type == 'Folder'
    path: {
      parentFolder: {type: String, index: true},
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
  },

  initSchema: function(documentSchema) {
    documentSchema.virtual('path.absolutePath').get(function() {
      return this.path.parentFolder + '/' + this.editable.name;
    })
  }
} 