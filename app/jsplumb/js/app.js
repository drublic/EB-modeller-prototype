
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


Modeller.Connection.reopen({

	render : function () {

		var item = this;

		jsPlumb.connect({
			source: item.source,
		  target: item.target,
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
 					label : item.label.title,
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


// View for Modells
Modeller.ModellerView = Ember.View.extend({
	templateName : 'components',

	// After the elements are inserted
	didInsertElement : function () {

		// Find all connections in storage
		var connections = Modeller.Storage.findAllByType("Connection");

		// Render Connections
		connections.forEach( function (item) {
			item.render();
		});
		
		// make components draggable
		jsPlumb.draggable( $('.component') );
	}
});

Modeller.componentView = Modeller.ModellerView.create();
Modeller.componentView.appendTo('.main');






// Drag-events for components
var timestamp = 0;
$(document).on('drag', '.component', function (e) {

	// Check if timestemps differ more then 100ms
	if ((e.timeStamp - timestamp) > 100) {
		var offset = $(this).offset();

		// Update Classes
		var draggedModell = Modeller.Storage.findById(this.id);
		draggedModell.set('position', {
			top : offset.top,
			left : offset.left
		});



		timestamp = e.timeStamp;
	}
});

