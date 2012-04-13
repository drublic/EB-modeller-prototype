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
			var properties;
			if (model.get('_type') === "Modell") {
				properties = model.getProperties('id', 'title', 'desc', 'position', '_type');
			} else if (model.get('_type') === "Connection") {
				properties = model.getProperties('source', 'target', 'label', '_type');
			} else {
				properties = model.get('id');
			}

			this.data[model.get('id')] = properties;
			this.save();
			return model;
		};

		// Retrieve a model from `this.data` by id.
		this.find = function (model, type) {
			if (type === undefined) {
				type = "Modell";
			}

			return Modeller[type].create(this.data[model.get('id')]);
		};


		// Retrieve a model by id.
		this.findById = function (id, type) {
			if (type === undefined) {
				type = "Modell";
			}

			return Modeller[type].create(this.data[id]);
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

		// Return the array of all models currently in storage.
		this.findAllByType = function(type) {
			if (type === undefined) {
				type = "Modell";
			}
			var result = [];
			for (var key in this.data) {
				if (this.data[key]._type === type) {
					var modells = Modeller[type].create(this.data[key]);
					result.push(modells);
				}
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







