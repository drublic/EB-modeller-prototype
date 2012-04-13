
// Init
+ function () {
	Modeller.modells = Modeller.Storage.findAllByType();

	// If items is empty, add two components
	if (Modeller.modells.length < 1) {
		var modell_1, modell_2;

		modell_1 = Modeller.ModellerController.createModell("Window 1", "I am plumbed with a Bezier connector to Window 2 and a label");
		modell_2 = Modeller.ModellerController.createModell("Window 2", "I am plumbed with a Bezier connector to Window 1.");

		Modeller.ModellerController.createConnection(modell_1.id, modell_2.id, "A Connection");

		Modeller.modells = Modeller.Storage.findAllByType();
	}

	// Save all that stuff in modellerController
	Modeller.ModellerController.set('[]', Modeller.modells);
} ();



