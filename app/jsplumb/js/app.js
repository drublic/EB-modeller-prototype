
// IIFE fo fastr XS
+ function ($, exports, undefined) {

	Modeller = Ember.Application.create({ 
		name : "A test moduler",
		desc : "This is test-modeller for the TYPO3 Extension Builder."
	});

	
	var _plumber = {
		colors : {
			connector_stroke : "rgba(100, 100, 100, 1)",
			connector_stroke_highlight : "rgba(200, 200, 200, 1)",
			outline : "rgba(50, 50, 50, 1)",
			hover_paint : {
				 strokeStyle: "#7ec3d9"
			},
			endpoint : {
				fillStyle: "#a7b04b"
			}
		}
	};



	var	dialogue = function () {
		var view = Modeller.dialogueView.create({
			title : "Add Component"
		});

		return {
			add : function () {
				var template, output;

				$('body').append('<div class="overlay"></div>');

				// Append it to the body
				view.append();
			},

			close : function () {
				view.remove();
				$('.dialogue').remove();
				$('.overlay').remove();
			}
		}
	};



	Modeller.Storage = (function () {
	  
	  // Generate four random hex digits.
	  var S4 = function () {
	     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	  };

	  // Generate a pseudo-GUID by concatenating random hexadecimal.
	  var guid = function () {
	     return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	  };

	  // Our Store is represented by a single JS object in *localStorage*. Create it
	  // with a meaningful name, like the name you'd give a table.
	  var Store = function(name) {
	    this.name = name;
	    var store = localStorage.getItem(this.name);
	    this.data = (store && JSON.parse(store)) || {};

	    // Save the current state of the **Store** to *localStorage*.
	    this.save = function() {
	      localStorage.setItem(this.name, JSON.stringify(this.data));
	    };

	    // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
	    // have an id of it's own.
	    this.create = function (model) {
	      if (!model.get('id')) model.set('id', guid());
	      return this.update(model);
	    };

	    // Update a model by replacing its copy in `this.data`.
	    this.update = function (model) {
	      this.data[model.get('id')] = model.getProperties('id', 'title', 'desc');
	      this.save();
	      return model;
	    };

	    // Retrieve a model from `this.data` by id.
	    this.find = function (model) {
	      return Modeller.Modell.create(this.data[model.get('id')]);
	    };

	    // Return the array of all models currently in storage.
	    this.findAll = function() {
	      var result = [];
	      for (var key in this.data) {
	        var modells = Modeller.Modell.create(this.data[key]);
	        result.push(modells);
	      }

	      return result;
	    };

	    // Delete a model from `this.data`, returning it.
	    this.remove = function(model) {
	      delete this.data[model.get('id')];
	      this.save();
	      return model;
	    };
	  };

	  return new Store('_modeller');
	})();






	// Create an Modell object
	Modeller.Modell = Ember.Object.extend({
		id : null,
		title : null,
		desc : null,

		// If anything changes in this model, this Storage is updated
	  modellChanged: function () {
	    Modeller.Storage.update(this);
	  }.observes('title', 'desc')
	});


	// View for Modells
	Modeller.modellerView = Ember.View.create({
		templateName : 'components',
		modells : Modeller.Storage.findAll(),

		didInsertElement : function () {
			// make components draggable
			jsPlumb.draggable( $('.component') );

			Modeller.connections.forEach(function (item) {
				item.render();
			});
		}
	});


	// Connections
	Modeller.Connection = Ember.Object.extend({
		source : null,
		target : null,
		label : {
			title : null
		},

		render : function () {
			var that = this;

			jsPlumb.connect({
				source: that.source,
			  target: that.target,
			  cssClass: "connection",
			  endpointClass: "c1Endpoint",
			  anchors: ["BottomCenter", [ 0.75, 0, 0, -1 ]],
			  paintStyle: {
					lineWidth: 2,
					strokeStyle: _plumber.colors.connector_stroke
				},
			  overlays : [
			  	["Label", {
	 					cssClass: "label",
	 					label : that.label.title,
	 				}]
				]
			});
		}

	});


	Modeller.connections = [
		Modeller.Connection.create({
			source : "window-1",
			target : "window-2",
			label : {
				title : "A connection"
			}
		})
	];



	// Template for dialogue
	Modeller.dialogueView = Ember.View.extend({
		templateName : 'dialogue',
		classNames : ['dialogue'],

		title : null,
		modell : {
			title : null,
			desc : null
		},
		connection : {
			title : null
		},
		modells : Modeller.modells
	});


	Modeller.modellerController = Ember.ArrayProxy.create({
	  content: [],

	  createModell: function (title, desc) {
	    var modell = Modeller.Modell.create({
	    	title : title,
	    	desc : desc
	   	});
	    this.pushObject(modell);
	    return Modeller.Storage.create(modell);
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






	// Init Modells
	+ function () {
		var items = Modeller.Storage.findAll();

		// If items is empty, add two components
		if (items.length < 1) {
			Modeller.modellerController.createModell("Window 1", "I am plumbed with a Bezier connector to Window 2 and a label");
			Modeller.modellerController.createModell("Window 2", "I am plumbed with a Bezier connector to Window 1.");

			items = Modeller.Storage.findAll();
		}

		Modeller.modellerController.set('[]', items);
		Modeller.modellerView.appendTo('.main');
	} ();


	// Events
	$(document)

		// When clicking to add a component
		.on('click', '.add-component', function (e) {
			e.preventDefault();
			dialogue().add();
		})

		// Dialogue close
		.on('click', '.dialogue-close', function () {
			dialogue().close();
		})

		// Overlay
		.on('click', '.overlay', function () {
			dialogue().close();
		})

		// Esc
		.on('keydown', function (e) {
			e.keyCode === 27 && dialogue().close();
		});



} (jQuery, window);

