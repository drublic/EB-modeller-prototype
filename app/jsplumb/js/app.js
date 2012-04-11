
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

