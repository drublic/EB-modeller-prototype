

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
  }.observes('source', 'target', 'label'),

	render : function () {
		var that = this;

		jsPlumb.connect({
			source: that.source,
		  target: that.target,
		  cssClass: "connection",
		  connector: "StateMachine",
		  endpoint: "Blank",
		  anchor: "AutoDefault",
		  paintStyle: {
				lineWidth: 2,
				strokeStyle: _plumber.colors.connector_stroke
			},
		  overlays : [
		  	["Label", {
 					cssClass: "label",
 					label : that.label.title,
 				}],
 				["PlainArrow", {
 					location: 1,
 					width: 20,
 					length: 12
 				}]
			]
		});
	}

});





