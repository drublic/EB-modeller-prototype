
// IIFE fo fastr XS
+ function ($, exports, undefined) {

	
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
			title : "Add Component",
			classNames : ['dialogue', 'dialogue-add']
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






	// Create an Modell object
	Modeller.Modell = Ember.Object.extend({
		id : null,
		title : null,
		desc : null,
	  _type : "Modell",

		// If anything changes in this model, this Storage is updated
	  modellChanged: function () {
	    Modeller.Storage.update(this);
	  }.observes('title', 'desc')
	});


	// View for Modells
	Modeller.modellerView = Ember.View.create({
		templateName : 'components',
		modells : Modeller.Storage.findAllByType(),

		// After the elements are inserted
		didInsertElement : function () {

			// Find all connections in storage
			var connections = Modeller.Storage.findAllByType("Connection");

			// make components draggable
			jsPlumb.draggable( $('.component') );

			// Render Connections
			connections.forEach(function (item) {
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



	// Template for dialogue
	Modeller.dialogueView = Ember.View.extend({
		templateName : 'dialogue',
		classNames : ['dialogue'],
		tagName : 'form',

		title : null,
		modell : {
			title : null,
			desc : null
		},
		connection : {
			title : null
		},
		modells : Modeller.Storage.findAllByType()
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






	// Init Modells
	+ function () {
		var items = Modeller.Storage.findAllByType();

		// If items is empty, add two components
		if (items.length < 1) {
			var modell_1, modell_2;

			modell_1 = Modeller.modellerController.createModell("Window 1", "I am plumbed with a Bezier connector to Window 2 and a label");
			modell_2 = Modeller.modellerController.createModell("Window 2", "I am plumbed with a Bezier connector to Window 1.");

			Modeller.modellerController.createConnection(modell_1.id, modell_2.id, "A Connection");

			items = Modeller.Storage.findAllByType();
		}

		// Save all that stuff in modellerController
		Modeller.modellerController.set('[]', items);

		// Rendering for views
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
		})


		// Submitting form
		.on('submit', '.dialogue-add', function (e) {
			e.preventDefault();

			var new_modell,
					isComplete = true,
					values = {},
					$fields = $(this).find('input, textarea, select');
			
			$fields.each(function () {
				if ($(this).attr('id')) {
					values[$(this).attr('id')] = $(this).val();

					if (!$(this).val()) {
						isComplete = false;
					}
				}
			});

			if (!isComplete) {
				return false;
			}

			// Set a new object
			new_modell = Modeller.modellerController.createModell(values['modell-title'], values['modell-desc']);

			// Set connections?
			if (values['modell-relation']) {
				Modeller.modellerController.createConnection(new_modell.id, values['modell-relation'], values['connection-title']);
			}

			dialogue().close();
		})









		;



} (jQuery, window);

