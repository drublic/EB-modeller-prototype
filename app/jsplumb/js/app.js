
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

		},
			
		init : function () {
			
			jsPlumb.DefaultDragOptions = {
				cursor: "pointer",
				zIndex: 2000
			};

			//
			var connection1 = jsPlumb.connect({
					source:"window1", 
			   	target:"window2", 			   	
					connector:"Bezier",
			   	cssClass:"c1",
			   	endpoint:"Blank",
			   	endpointClass:"c1Endpoint",													   
			   	anchors:["BottomCenter", [ 0.75, 0, 0, -1 ]], 
			   	paintStyle:{ 
					lineWidth:6,
					strokeStyle: this.colors.connector_stroke,
					outlineWidth:1,
					outlineColor: this.colors.outline
				},
				endpointStyle: this.colors.endpoint,
			  hoverPaintStyle: this.colors.hover_paint,
			  overlays : [
			  	["Label", {
	 					cssClass:"l1 component label",
	 					label : "A connection", 
	 					location: 0.5,
	 					id: "label-1",
	 					events: {
							"click" : function (label, e) {
								log("Click on label");
	 						}
	 					}
	 				}]
				]
			});

			


			// jsplumb event handlers
	
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
				log("content menu click")
			});
			
			
			// make components draggable
			jsPlumb.draggable( $('.window') );
            
		}
	};






	// Create an Modell object
	var Modell = Ember.Object.extend({
		id : null,
		title : null,
		desc : null
	});

	// Create a collection for Modell
	var modells = [
		Modell.create({
			id : "window-1",
			title : "Window 1",
			desc : "I am plumbed with a Bezier connector to Window 2 and a label, with Blank endpoints."
		}),
		Modell.create({
			id : "window-2",
			title : "Window 2",
			desc : "I am plumbed with a Bezier connector to Window 1."
		})
	];


	// View for Modells
	var modellerView = Ember.View.create({
		templateName : 'components',
		modells : modells,

		didInsertElement : function () {
			// make components draggable
			jsPlumb.draggable( $('.component') );

			connections.forEach(function (item) {
				item.render();
			});
		}
	});

	modellerView.appendTo('.main');



	// Connections
	var Connection = Ember.Object.extend({
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


	var connections = [
		Connection.create({
			source : "window-1",
			target : "window-2",
			label : {
				title : "A connection"
			}
		})
	];



	// Template for dialogue
	var dialogueView = Ember.View.extend({
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
		modells : modells
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

