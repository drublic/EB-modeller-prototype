
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



} (jQuery, window);

