$('#ajoutCommentaire').submit(function (e) {
	$('.alert.alert-danger').hide();
	if (!$('input#nom').val() || !$('select#note').val() || !$('textarea#texte').val()) {

		if ($('.alert.alert-danger').length) {
			$('.alert.alert-danger').show();
		} else {
			$(this).prepend('<div role="alert" class="alert alert-danger">Tous les champs sont requis, veuillez essayer de nouveau.</div>');
		}
		return false;
	}
});

tinymce.init({ selector:'textarea' });
