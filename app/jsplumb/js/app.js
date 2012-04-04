
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


	// handles the first init
	jsPlumb.bind("ready", function() {

	  // render mode
		var resetRenderMode = function (desiredMode) {
			_plumber.init();
		};

		resetRenderMode(jsPlumb.SVG);
	});


} (jQuery, window);

