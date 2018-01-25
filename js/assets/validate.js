$(".validate-form").validate({
  rules: {
    name: {
      required: true
    },
    lastName: {
      required: true
    },
    email: {
      required: true,
      email: true
    },
    birthDate: {
      required: true
    },
    password: {
      regx: /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*.{6,20})$/
    },
    password_confirm: {
      equalTo: "#password",
      depends: function(element) {
        return $("#password").val() != "";
      }
    },
    origenCable: { required: true },
    port: { required: true },
    user: { required: true },
    url: {
      regx: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
    }
  },
  //For custom messages
  messages: {
    name: {
      required: "Este campo es obligatorio"
    },
    lastName: {
      required: "Este campo es obligatorio"
    },
    email: {
      required: "Este campo es obligatorio",
      email:
        "El mail debe tener un formato v&aacute;lido,por ejemplo: usuario@mail.com"
    },
    birthDate: {
      required: "Este campo es obligatorio"
    },
    password_confirm: {
      equalTo:
        "La contrase&ntilde;a de confirmaci&oacute;n debe ser igual a la contrase&ntilde;a nueva.",
      required: "Debe confirmar la contrase&ntilde;a"
    },
    origenCable: { required: "Este campo es requerido" },
    port: { required: "Este campo es requerido" },
    user: { required: "Este campo es requerido" },
    password: { required: "Este campo es requerido",
  regx:"Su contrase&ntilde;a debe contener al menos una may&uacute;scula, una min&uacute;scula, y un n&uacute;mero, y debe tener al menos 8 caracteres." },
    url: {
      regx: "Ingrese una url v&aacutelida"
    }
  },
  errorElement: "div",
  errorPlacement: function(error, element) {
    var placement = $(element).data("error");
    if (placement) {
      $(placement).append(error);
    } else {
      error.insertAfter(element);
    }
  }
});
$.validator.addMethod("regx", function (value, element, regexpr) {
    return regexpr.test(value);
});
