
// Init
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



