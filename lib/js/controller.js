Modeller.modellerController = Ember.ArrayProxy.create({
  content: [],


  createModell: function (title, desc) {
    var modell = Modeller.Modell.create({
    	title : title,
    	desc : desc,
      position : {
        top: 0,
        left: 0
      }
   	});
    this.pushObject(modell);
    return Modeller.Storage.create(modell);
  },


  createConnection: function (source, target, title) {
    var connection = Modeller.Connection.create({
    	source : source,
    	target : target,
    	label : {
    		title : title
    	}
   	});
    this.pushObject(connection);
    return Modeller.Storage.create(connection);
  },

  pushObject: function (item, ignoreStorage) {
    if (!ignoreStorage)
      Modeller.Storage.create(item);
    return this._super(item);
  },

  removeObject: function (item) {
    Modeller.Storage.remove(item);
    return this._super(item);
  }
});
