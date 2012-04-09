
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
		},
			
		init : function () {
			
			jsPlumb.DefaultDragOptions = {
				cursor: "pointer",
				zIndex: 2000
			};

			// jsPlumb event handlers
	
			// double click on any connection 
			jsPlumb.bind("dblclick", function(connection, e) {
				log("double click on connection from " + connection.sourceId + " to " + connection.targetId);
			});
			
			// single click on any endpoint
			jsPlumb.bind("endpointClick", function(endpoint, e) {
				log("click on endpoint on element " + endpoint.elementId);
			});
			
			// context menu
			jsPlumb.bind("contextmenu", function(component, e) {
				log("content menu click");
			});
            
		},



		dialogue : function () {
			var view = Modeller.dialogueView.create({
				title : "Add Component"
			});

			return {
				add : function () {
					var template, output,
							data = {};

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
		}
	};






	// Create an Modell object
	Modeller.Modell = Ember.Object.extend({
		id : null,
		title : null,
		desc : null
	});

	// Create a collection for Modell
	Modeller.modells = [
		Modeller.Modell.create({
			id : "window-1",
			title : "Window 1",
			desc : "I am plumbed with a Bezier connector to Window 2 and a label, with Blank endpoints."
		}),
		Modeller.Modell.create({
			id : "window-2",
			title : "Window 2",
			desc : "I am plumbed with a Bezier connector to Window 1."
		})
	];


	// View for Modells
	Modeller.modellerView = Ember.View.create({
		templateName : 'components',
		modells : Modeller.modells,

		didInsertElement : function () {
			// make components draggable
			jsPlumb.draggable( $('.component') );

			Modeller.connections.forEach(function (item) {
				item.render();
			});
		}
	});

	Modeller.modellerView.appendTo('.main');



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





	// handles the first init
	jsPlumb.bind("ready", function() {

	  // render mode
		var resetRenderMode = function (desiredMode) {
			_plumber.init();
		};

		resetRenderMode(jsPlumb.SVG);
	});






	// Events
	$(document)

		// When clicking to add a component
		.on('click', '.add-component', function (e) {
			e.preventDefault();

			_plumber.dialogue().add();
		})
		
		// Dialogue close
		.on('click', '.dialogue-close', function () {
			_plumber.dialogue().close();
		})

		// Overlay
		.on('click', '.overlay', function () {
			_plumber.dialogue().close();
		})

		// Esc
		.on('keydown', function (e) {
			e.keyCode === 27 && _plumber.dialogue().close();
		});



} (jQuery, window);

