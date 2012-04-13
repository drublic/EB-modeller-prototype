

Modeller.dialogue = function () {
	var view = Modeller.dialogueView.create({
		title : "Add Component",
		classNames : ['dialogue', 'dialogue-add'],
		modells : Modeller.Storage.findAllByType()
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
	modells : []
});




// Events
$('body')

	// When clicking to add a component
	.on('click', '.add-component', function (e) {
		e.preventDefault();
		Modeller.dialogue().add();
	})

	// Dialogue close
	.on('click', '.dialogue-close', function () {
		Modeller.dialogue().close();
	})

	// Overlay
	.on('click', '.overlay', function () {
		Modeller.dialogue().close();
	})

	// Esc
	.on('keydown', function (e) {
		e.keyCode === 27 && Modeller.dialogue().close();
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
		new_modell = Modeller.ModellerController.createModell(values['modell-title'], values['modell-desc']);

		// Set connections?
		if (values['modell-relation']) {
			Modeller.ModellerController.createConnection(new_modell.id, values['modell-relation'], values['connection-title']);
		}

		Modeller.dialogue().close();
	});





