$(document).ready(function() {
  $("#menu-anotar").hide();

  $(".fixed-action-btn").openFAB();
  $(".modal").modal({
    dismissible: true
  });
  $("#ver-embebido").click(function() {
    $("#embebido").modal("open");
  });
  $("#ver-anotado").click(function() {
    $("#anotado").modal("open");
    $("#textarea1")
      .val("")
      .hide();
  });

  $(".scrollspy").scrollSpy();

  // Initialize collapse button
  $(".button-collapse").sideNav();
  $(".tooltipped").tooltip({ delay: 50 });
  $("select:not(.chosen-select)").material_select();

  $(".timepicker").pickatime({
    default: "now", // Set default time: 'now', '1:30AM', '16:30'
    twelvehour: true, // Use AM/PM or 24-hour format
    donetext: "Guardar", // text for done-button
    cleartext: "", // text for clear-button
    canceltext: "Cancelar", // Text for cancel-button
    ampmclickable: true,
    container: "#container-picker"
    //$("#horario-reporte").val("10:30AM") para darle valor
  });
  $('.datepicker').pickadate({

    selectMonths: true, // Creates a dropdown to control month
    selectYears: 90, // Creates a dropdown of 15 years to control year,
    today: 'Hoy',
    clear: 'Limpiar',
    close: 'Listo',
    closeOnSelect: false, // Close upon selecting a date,
    monthsFull: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weekdaysFull: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    max: "Today",
    showMonthsShort: false,
    format: 'dd/mm/yyyy',
    onSet: function () {
        $("label[for='birthDate']").addClass('active')
    }
});
  $(".ui.dropdown").dropdown({
    message: {
      addResult: "Add <b>{term}</b>",
      count: "{count} selected",
      maxSelections: "Max {maxCount} selections",
      noResults: "No se encuentran resultados."
    },
    onShow: function(value, text, $selectedItem) {
      $(this)
        .children("label")
        .addClass("active");
    }
  });

  /***************Las flechas del desplazamiento de cateorias del header **********/
  $("#rightArrow").click(function() {
    //calculo mas o menos cuánto van a medir los elementos para no dejar ninguno afuera
    var widthOfAllElements = $(".bktibx").length * 30 * -1;
    var currentPosition = parseInt($("#tslshow").css("left"));
    if (currentPosition >= widthOfAllElements)
      $("#tslshow")
        .stop(false, true)
        .animate({ left: "-=50px" }, { duration: 400 });
  });

  $("#leftArrow").click(function() {
    var currentPosition = parseInt($("#tslshow").css("left"));
    if (currentPosition < 0) {
      $("#tslshow")
        .stop(false, true)
        .animate({ left: "+=75px" }, { duration: 400 });
    }
  });
  /*******************************************cuando se hace clic en las catgorias del header ***********************************************/
  $(".tab-search").each(function(index, ele) {
    var id = $(ele).attr("id");
    var value = $(ele).attr("value");
    var urlendpoint =
      "/searchChanges/" +
      idMedia +
      "/" +
      idRss +
      "/" +
      listAgencies +
      "/" +
      id +
      "/" +
      value;
    $.ajax({
      url: urlendpoint,
      cache: false,
      async: false,
      success: function(result) {
        if (result > 0) {
          var split = String(id).split("_");
          if (split[1] != null) {
            document.getElementById("news_search_" + split[1]).style.display =
              "block";
          } else {
            $("#news_".concat(id)).css("display", "block");
          }
        }
      },
      error: function(xhr, ajaxOptions, error) {
        //do nothing
      }
    });
  });

  /***************************cuando hacen clic en la nube de tags***********************************/
  $(".tags").click(function(e) {
    abrirTabs($(this)[0].innerText);
  });
  /*********************************limpiar la busqueda*****************************/
  $("#cancelarBusqueda").click(function() {
    $("#search").val("");
    $("#busqueda label").removeClass("active");
    $("#search").blur();
  });

  /***************************************abrir un tag cuando busca en el cuadro de busqueda************/
  $("#busquedaForm").submit(function(e) {
    e.preventDefault();
    abrirTabs($("#search").val());
  });
  $("#tabs-swipe-demo li.tab a").click(function() {
    console.log("tab");
    var text = $(this).text();
    $(".indicator").show();
    abrirTabs(text);
  });
  /*****************************cerrar tab********************/
  $("#cerrar-tab").click(function() {
    $("#body-tarjeta").hide();
    $(".tab.active")
      .removeClass(".active")
      .hide();
    $(this)
      .closest(".tab")
      .addClass("active");
    $(".indicator").hide();
    if ($(".tab").length == 0) {
      $("#tabs-container").remove();
    }
  });

  $(".card.piezas").click(function() {
    $("#embebido").modal("open");
  });

  $("#anotar").click(function() {
    $("#embebido").modal("close");
    $("#anotado").modal("open");
  });

  $("#anotado").on("mouseup", function(e) {
    if (window.getSelection) {
      // obtienen el texto seleccionADO

      selection = window.getSelection();
    } else if (document.selection) {
      selection = document.selection.createRange();
    }
    if (selection.toString() !== "") {
      $(".footer textarea").text(selection);
    }
    $("p text:selected").css({
      color: "red"
    });
  });

  $("#anotado #anotar").on("click", function(e) {
    $("#anotado .footer").removeClass("hide");
    $("#anotado label").addClass("active");
    $("#anotado textarea").focus();
  });
}); //fin document.ready

//esta funcion abre los tabs de tarjetas
function abrirTabs(leyenda) {
  $("#tabs-container").show();
  $("li.tab").removeClass("active");
  $("#body-tarjeta").show();
  $(".indicator").show();
  // aca deberia ir el ajax de consulta
  // $('#tabs-swipe-demo').append('<li class="tab active"><button type="button" id="cerrar-tab btn green"><i class="material-icons">close</i></button><span><a href="#body-tarjeta">' + leyenda + '</a></span></li>');
  $("#tabs-swipe-demo").append(
    '<li class="tab active"><a href="#body-tarjeta">' + leyenda + "</a></li>"
  );
  $("li.tab.active a").click();
  //comentar para seguir creando tabs
  $("#cancelarBusqueda").click();
}
$(".orderable").click(function () {
  $(".orderable").removeClass('ordered').addClass('to-switch')
  $(this).removeClass('to-switch').addClass('ordered')
  // traer el data option (que es lo que se esta tocando)
  // console.log($(this).attr("data-option"))
  //al hacer click cambiamos la flechita y el texto del tooltip
  var id = $(this).attr("data-tooltip-id")
  if ($(this).children('.material-icons').text() == "arrow_drop_down") {
    $("#" + id + " span").text('Ordenar ascendientemente')
    $(this).html('').append('<i class="material-icons">arrow_drop_up</i>')

  } else {
    $("#" + id + " span").text('Ordenar descendientemente')
    $(this).html('').append('<i class="material-icons">arrow_drop_down</i>')


  }
})

function toastOpen(mensaje, clase, otra) {
  Materialize.toast(mensaje, 1500, 'rounded ' + clase, function () {
    $("#cerrar-modal").click();
  })
}