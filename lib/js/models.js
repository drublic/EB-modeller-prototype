

// Create an Modell object
Modeller.Modell = Ember.Object.extend({
	id : null,
	title : null,
	desc : null,
	position: {
		top : 0,
		left : 0
	},
  _type : "Modell",

	// If anything changes in this model, this Storage is updated
  modellChanged: function () {
    Modeller.Storage.update(this);
  }.observes('title', 'desc', 'position')
});


// Connections
Modeller.Connection = Ember.Object.extend({
	source : null,
	target : null,
	label : {
		title : null
	},
	_type : "Connection",

	// If anything changes in this model, this Storage is updated
  modellChanged: function () {
    Modeller.Storage.update(this);
  }.observes('source', 'target', 'label')
});





