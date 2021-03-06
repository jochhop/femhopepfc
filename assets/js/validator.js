$(document).ready(function() {

	// validate signup form on keyup and submit
	$("#registerUserForm").validate({
		rules: {
			name: "required",
			surname: "required",
			sex: "required",
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				minlength: 8
			},
			passwordConfirmation: {
				required: true,
				minlength: 8,
				equalTo: "#password"
			},
			postalCode:{
				required:true,
				minlength: 5,
				maxlength: 5
			},
			province: "required",
			city: "required",
			address: "required",
			number: "required",
			requiredPhone: {
				required: true,
				maxlength:9,
				minlength:9
			},
			extraPhone: {
				maxlength:9,
				minlength:9
			},
			agree: "required"
		},
		messages: {
			name: "Por favor, introduzca su nombre.",
			surname: "Por favor, introduzca sus apellidos.",
			sex: "Por favor, indique su sexo.",
			email: "Por favor, introduzca una dirección de correo válida.",
			password: {
				required: "Por favor, introducza una contraseña.",
				minlength: "La contraseña debe tener al menos 8 caracteres."
			},
			passwordConfirmation: {
				required: "Por favor, confirme su contraseña.",
				minlength: "La contraseña debe tener al menos 8 caracteres.",
				equalTo: "Por favor, introduzca una contraseña que coincida con la de arriba."
			},
			postalCode: {
				required: "Por favor, introduzca el código postal.",
				minlength: "El código postal debe tener 5 dígitos.",
				maxlength: "El código postal debe tener 5 dígitos."
			},
			province: "Por favor, seleccione una provincia.",
			city: "Por favor, seleccione una ciudad.",
			address: "Por favor, indique su calle.",
			number: "Por favor, indique el número de su vivienda.",
			requiredPhone: {
				required: "Por favor, introduzca un teléfono.",
				maxlength: "El teléfono debe tener 9 dígitos.",
				minlength: "El teléfono debe tener 9 dígitos."
			},
			extraPhone: {
				maxlength: "El teléfono debe tener 9 dígitos.",
				minlength: "El teléfono debe tener 9 dígitos."
			},
			agree: "Para continuar, debe aceptar los términos y condiciones de Femhope."
		}
	});

	// validate edit profile form on keyup and submit
	$("#editUserForm").validate({
		rules: {
			name: "required",
			surname: "required",
			password: {
				minlength: 8
			},
			passwordConfirmation: {
				minlength: 8,
				equalTo: "#password"
			},
			postalCode:{
				required:true,
				minlength: 5,
				maxlength: 5
			},
			province: "required",
			city: "required",
			address: "required",
			number: "required",
			requiredPhone: {
				required: true,
				maxlength:9,
				minlength:9
			},
			extraPhone: {
				maxlength:9,
				minlength:9
			}
		},
		messages: {
			name: "Por favor, introduzca su nombre.",
			surname: "Por favor, introduzca sus apellidos.",
			password: {
				minlength: "La contraseña debe tener al menos 8 caracteres."
			},
			passwordConfirmation: {
				minlength: "La contraseña debe tener al menos 8 caracteres.",
				equalTo: "Por favor, introduzca una contraseña que coincida con la de arriba."
			},
			postalCode: {
				required: "Por favor, introduzca el código postal.",
				minlength: "El código postal debe tener 5 dígitos.",
				maxlength: "El código postal debe tener 5 dígitos."
			},
			province: "Por favor, seleccione una provincia.",
			city: "Por favor, seleccione una ciudad.",
			address: "Por favor, indique su calle.",
			number: "Por favor, indique el número de su vivienda.",
			requiredPhone: {
				required: "Por favor, introduzca un teléfono.",
				maxlength: "El teléfono debe tener 9 dígitos.",
				minlength: "El teléfono debe tener 9 dígitos."
			},
			extraPhone: {
				maxlength: "El teléfono debe tener 9 dígitos.",
				minlength: "El teléfono debe tener 9 dígitos."
			}
		}
	});

	// validate signup form on keyup and submit
	$("#registerOrganizationForm").validate({
		rules: {
			name: "required",
			nif: {
				required: true,
				maxlength:8,
				minlength:8
			},
			services: "required",
			description : "required",
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				minlength: 8
			},
			passwordConfirmation: {
				required: true,
				minlength: 8,
				equalTo: "#password"
			},
			postalCode:{
				required:true,
				minlength: 5,
				maxlength: 5
			},
			province: "required",
			city: "required",
			address: "required",
			number: "required",
			requiredPhone: {
				required: true,
				maxlength:9,
				minlength:9
			},
			extraPhone: {
				maxlength:9,
				minlength:9
			},
			agree: "required"
		},
		messages: {
			name: "Por favor, introduzca su nombre.",
			nif: {
				required: "Por favor, introducza el nif.",
				maxlength: "El nif debe tener 8 caracteres.",
				minlength: "El nif debe tener 8 caracteres."
			},
			services: "Por favor, indique los servicios que ofrece.",
			description: "Por favor, rellene la descripción.",
			email: "Por favor, introduzca una dirección de correo válida.",
			password: {
				required: "Por favor, introducza una contraseña.",
				minlength: "La contraseña debe tener al menos 8 caracteres."
			},
			passwordConfirmation: {
				required: "Por favor, confirme su contraseña.",
				minlength: "La contraseña debe tener al menos 8 caracteres.",
				equalTo: "Por favor, introduzca una contraseña que coincida con la de arriba."
			},
			postalCode: {
				required: "Por favor, introduzca el código postal.",
				minlength: "El código postal debe tener 5 dígitos.",
				maxlength: "El código postal debe tener 5 dígitos."
			},
			province: "Por favor, seleccione una provincia.",
			city: "Por favor, seleccione una ciudad.",
			address: "Por favor, indique su calle.",
			number: "Por favor, indique el número de su vivienda.",
			requiredPhone: {
				required: "Por favor, introduzca un teléfono.",
				maxlength: "El teléfono debe tener 9 dígitos.",
				minlength: "El teléfono debe tener 9 dígitos."
			},
			extraPhone: {
				maxlength: "El teléfono debe tener 9 dígitos.",
				minlength: "El teléfono debe tener 9 dígitos."
			},
			agree: "Para continuar, debe aceptar los términos y condiciones de Femhope."
		}
	});

	//validate edit profile form on keyup and submit
	$("#editOrganizationForm").validate({
		rules: {
			name: "required",
			nif: {
				required: true,
				maxlength:8,
				minlength:8
			},
			services: "required",
			password: {
				minlength: 8
			},
			passwordConfirmation: {
				minlength: 8,
				equalTo: "#password"
			},
			postalCode:{
				required:true,
				minlength: 5,
				maxlength: 5
			},
			province: "required",
			city: "required",
			address: "required",
			number: "required",
			requiredPhone: {
				required: true,
				maxlength:9,
				minlength:9
			},
			extraPhone: {
				maxlength:9,
				minlength:9
			}
		},
		messages: {
			name: "Por favor, introduzca su nombre.",
			services: "Por favor, introduzca algún servicio.",
			nif: {
				required: "Por favor, introducza el nif.",
				maxlength: "El nif debe tener 8 caracteres.",
				minlength: "El nif debe tener 8 caracteres."
			},
			password: {
				minlength: "La contraseña debe tener al menos 8 caracteres."
			},
			passwordConfirmation: {
				minlength: "La contraseña debe tener al menos 8 caracteres.",
				equalTo: "Por favor, introduzca una contraseña que coincida con la de arriba."
			},
			postalCode: {
				required: "Por favor, introduzca el código postal.",
				minlength: "El código postal debe tener 5 dígitos.",
				maxlength: "El código postal debe tener 5 dígitos."
			},
			province: "Por favor, seleccione una provincia.",
			city: "Por favor, seleccione una ciudad.",
			address: "Por favor, indique su calle.",
			number: "Por favor, indique el número de su vivienda.",
			requiredPhone: {
				required: "Por favor, introduzca un teléfono.",
				maxlength: "El teléfono debe tener 9 dígitos.",
				minlength: "El teléfono debe tener 9 dígitos."
			},
			extraPhone: {
				maxlength: "El teléfono debe tener 9 dígitos.",
				minlength: "El teléfono debe tener 9 dígitos."
			}
		}
	});

	//login form validation
	$("#loginForm").validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true
			}
		},
		messages: {
			email: "Por favor, introduzca una dirección de correo válida.",
			password: {
				required: "Por favor, introducza una contraseña."
			}
		}
	});

	//send message form validation
	$("#sendMessageForm").validate({
		rules: {
			subject: {
				required: true
			},
			message: {
				required: true
			}
		},
		messages: {
			subject: "Por favor introduczca el asunto.",
			message: "Por favor escriba el mensaje."
		}
	});
});