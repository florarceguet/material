
var searchScoutInterval = null;
//Carga de Scroll infinito y hover de tarjetas
$(document).ready(function () {

    if(searchScoutInterval==null){
        searchScoutInterval = setInterval('contador()',20000);
    }

    /***** Necesario para cargar el menu desplegable****/

    $(".button-collapse").sideNav();
    $('.tooltipped').tooltip({delay: 50});

    /**** ***/

    $('.modal').modal({
        dismissible: true
    });

    var timezone = calculate_time_zone();
    var listAgencies = getAgencies();
    var URLactual = window.location.pathname;
    var fields = URLactual.split('/');
    var idRss = 0;
    var idMedia = 0;

    if (fields[2] != null) {
        idMedia = fields[2];
        idRss = fields[3];
    }else{
        $("a[data-idcategoryrss=0][data-idcategorymedia=0]").parent().addClass("active");
    }

    //funcion para crear las tarjetas
    var url = "/generateCard/" + idMedia + "/" + idRss + "/" + listAgencies + "/" + timezone;
    generateCardofInfopieces(url);

    // <![CDATA[
    var uri = '/tagcloud?categoryMedia=' + idMedia + '&categoryRSS=' + idRss + '&agencies=' + listAgencies;

    $("#model").load(uri);
    // ]]>

    $("#add-tab").on("click", function (e) {
        var busqueda = $('#search-box').val();
        addBusqueda(busqueda,false);
    });

    /****** Funcion para el scroll infinito******/

    $(window).scroll(function () {

        var last = $("#lastSearch").val();

        if( $(this).scrollTop() > 50 ){
            $("#volverArriba").removeClass("hide");
        } else {
            $("#volverArriba").addClass("hide");
        }
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            // funcion para crear las tarjetas
            var listAgencies = getAgencies();
            var search = $('#selected_tab').val();
           if(search == null || search == ""){
               url = "/generateCard/" + idMedia + "/" + idRss + "/" + listAgencies + "/" + timezone + "?lastDate=" + last;
           }else{

               url = "/generateCardwithSearch/" + idMedia + "/" + idRss + "/" + listAgencies + "/" + search + "/" + timezone + "?lastDate=" + last;
           }
            generateCardofInfopieces(url);
        }
        $(".card").hover(function () {
            $(this).addClass('z-depth-5');
            $(this).css('cursor','pointer');
        },function() {
            $(this).removeClass('z-depth-5');
        });
    });

    /****** FIN scroll infinito******/

    $('.agencias').on("click", function () {
        var listAgencies = getAgencies();
        var search = $('#selected_tab').val();
        var url = "";

        // <![CDATA[
        var urlTC = "";
        var timezone = calculate_time_zone();

        if (!search) {
            url = "/generateCardwithCatAg/" + idMedia + "/" + idRss + "/" + listAgencies + "/" + timezone;
            urlTC += "/tagcloud?categoryMedia=" + idMedia + "&categoryRSS=" + idRss + "&agencies=" + listAgencies;
        } else {
            url = "/generateCardwithSearch/" + idMedia + "/" + idRss + "/" + listAgencies + "/" + search + "/" + timezone;
            urlTC += "/tagcloud?categoryMedia=" + idMedia + "&categoryRSS=" + idRss + "&agencies=" + listAgencies + "&search=" + search;
        }

        urlTC = encodeURI(urlTC);
        $("#model").load(urlTC);
        // ]]>

        //Genero Tarjetas a partir del filtro
        $('#frameCardsInfopieces').html('');
        generateCardofInfopieces(url)
    });

});

$( ".tab-search" ).on( "click", function() {
    todos($(this).attr("id"));
});

$("#btn-report").on("click", function () {
    addReport($(this).attr("id"));
});

$("#btn-alert").on("click", function () {
    addAlert($(this).attr("id"));
});

$(document).on("click", "span.btn-close", function () {
    closeTab(this);
});

$(document).on("click", "#cerrar-modal", function () {
    ocultarAnotacion();
});

//#region Al dar click en un TAB
function todos(e) {
    var last = $("#lastSearch").val();
    /*pintar el tab que se selecciono**/
    $('.tab.active').removeClass("active");
    $("a[id=" + e + "]").parent('.tab').addClass("active");
    /*customizar el input materialize de busqueda mejorada**/
    $(".busqueda-mejorada label").addClass("active");
    $("#moreSearch").focus();

    $('#frameCardsInfopieces').html('');
    var btn_alert = $('.btn-alert-search');
    var btn_report = $('.btn-report-search');

    $(".busqueda-mejorada").removeClass("hide");
    $("#moreSearch").val();

    var elemento = $("#".concat(e));
    var id = elemento.attr('id');
    var value = elemento.attr('value');
    btn_alert.attr("id", "Alert_" + e);
    btn_report.attr("id", "Report_" + e);

    $("#selected_tab").val(value);
    $("#moreSearch").val(value);

    var urlendpoint = "/alertisActive/" + id;
    $.ajax({
        url: urlendpoint,
        cache: false,
        async: false,
        success: function (result) {
            if (result > 0) {
                btn_alert.removeClass("hide");
                btn_alert.css("color", 'red');
            } else {
                btn_alert.removeClass("hide");
                btn_alert.css("color", 'black');
            }
        },
        error: function (xhr, ajaxOptions, error) {
            //do nothing
        }
    });

    var urlendpointReport = "/reportisActive/" + id;
    $.ajax({
        url: urlendpointReport,
        cache: false,
        async: false,
        success: function (result) {
            if (result > 0) {
                btn_report.removeClass("hide");
                btn_report.css("color", 'red');
            } else {
                btn_report.removeClass("hide");
                btn_report.css("color", 'black');
            }
        },
        error: function (xhr, ajaxOptions, error) {
            //do nothing
        }
    });

    $("#news_" + e).css('display', 'none');
    var search = $("#"+e).attr('value');
    var tab = $("#"+e);
    var listAgencies = getAgencies();

    var url = "";
    var idRss = elemento.data("categoryrss");
    var idMedia = elemento.data("categorymedia");
    var timezone = calculate_time_zone();

    url = "/generateCardwithSearch/" + idMedia + "/" + idRss + "/" + listAgencies + "/" + search + "/" + timezone ;
    generateCardofInfopieces(url);

    // <![CDATA[
    var urlTC = "/tagcloud";
    urlTC += "?categoryMedia=" + idMedia + "&categoryRSS=" + idRss + "&agencies=" + listAgencies + "&search=" + search;
    // ]]>

    var myurl = encodeURI(urlTC);
    $("#model").load(myurl);

}
//#endregion

//#region addMoreSearch - Funcion para agregar mas parametros a la busqueda.

function addMoreSearch(event,id) {
    var busqueda = $("#".concat(id)).val();
    var btn_alertId =$('.btn-alert-search').attr('id');
    var idInputActivewhitAlert = btn_alertId.split("Alert_"); //capturo el id de la busqueda sin importar si es nuevo.
    var idInputActive = idInputActivewhitAlert[1];
    var URLactual = window.location.pathname;
    var fields = URLactual.split('/');
    var idRss = 0;
    var idMedia = 0;

    if (fields[2] != null ) {
        idMedia = fields[2];
        idRss = fields[3];
    }

    tecla=(document.all) ? event.keyCode : event.which;
    if (tecla==13 || event.altKey) {
        //Verifico que la busqueda mejorada no sea una busqueda ya activa.
        var x = $(".tab-search");
        var acum = null;
        var cont=0;
        for (var ele in x) {
            cont++
            if (cont < x.length){
                var id = x[ele].id;
                var value = x[ele].getAttribute('value');
                if (value == busqueda){
                    acum = id;
                }
            }
        }
        if (acum != null){
            $("#".concat(acum)).click();
        }else{
            var busquedaAct = $("#".concat(idInputActive));
            var valueAnterior =  $("#selected_tab").val();

            var urlendpoint = "/search/" + idInputActive + "/" + valueAnterior + "/" + busqueda + "/" + idMedia + "/" + idRss;
            $.ajax({
                url: urlendpoint,
                cache: false,
                async: false,
                success: function () {
                    busquedaAct.html(busqueda);
                    busquedaAct.attr('value',busqueda);
                    $("#".concat(idInputActive)).click();
                    $("#selected_tab").val(busqueda);
                    $("#moreSearch").val(busqueda);
                },
                error: function (xhr, ajaxOptions, error) {
                    $("#errorSearchInfopieces").css("display", "block");
                }
            });
        }
    }
}

//#endregion

//#region closeTab - cierra el search seleccionado (softdelete).
function closeTab(tab) {
    $("#selected_tab").val("");
    var anchor = $(tab).siblings('a');
    var idElement = anchor.attr('id');
    $(".busqueda-mejorada").addClass("hide");
    var search = $("#".concat(idElement)).innerHTML;
    $(anchor.attr('href')).remove();
    $(tab).parent().remove();
    $(".nav-tabs li").children('a').first().click();
    $(".btn-report-search").addClass("hide");
    $(".btn-alert-search").addClass("hide");

    var listAgencies = getAgencies();
    var URLactual = window.location.pathname;
    var fields = URLactual.split('/');

    var idRss = 0;
    var idMedia = 0;

    if (fields[2] != null ) {
        idMedia =fields[2];
        idRss =fields[3];
    }

    var timezone = calculate_time_zone();

    var url = "/closeSearch/" + idMedia + "/" +idRss+ "/" + listAgencies + "/" + search + "/" + idElement + "/" + timezone;
    // <![CDATA[
    var urlTC = "/tagcloud";
    urlTC += "?categoryMedia=" + idMedia +"&categoryRSS=" + idRss + "&agencies=" + listAgencies;
    urlTC = encodeURI(urlTC);
    $("#model").load(urlTC);
    // ]]>

    $.ajax({
        url: url,
        cache: false,
        async: false,
        success: function (result) {
            window.location.href = $("#tslshow > div.btn-categories.bktibx.active > a").attr("href");
        },
        error: function (xhr, ajaxOptions, error) {
        }
    });
}
//#endregion

//#region addAlert addReport - Reflejar la activacion de Alertas y Reportes desde la vista
function addAlert(id) {
    var valueId = id.split('_');
    if(valueId.length == 3){
        var elemento = $("#"+valueId[1]);
    }else{
        var elemento = $("#"+valueId[1]);
    }
    var id = elemento.attr('id');

    var urlendpoint = "/saveAlertSearch/" + id ;
    $.ajax({
        url: urlendpoint,
        cache: false,
        async: false,
        success: function (result) {
            if (result > 0) {
                $("#Alert_"+id).css('color','red');
            } else {
                $("#Alert_"+id).css('color','black');
            }
        },
        error: function (xhr, ajaxOptions, error) {
            $("#errorAlert").css('display','block');
        }
    });
}

function addReport(id) {
    var valueId = id.split('_');
    if(valueId.length == 3){
        var elemento = $("#"+valueId[1]);
    }else{
        var elemento = $("#"+valueId[1]);
    }
    var id = elemento.attr('id');

    var URLactual = window.location.pathname;
    var fields = URLactual.split('/');

    var idRss = 0;
    var idMedia = 0;

    if (fields[2] != null ) {
        idMedia =fields[2];
        idRss =fields[3];
    }
    var urlendpoint = "/saveReportSearch/" + id ;

    $.ajax({
        url: urlendpoint,
        cache: false,
        async: false,
        success: function (result) {
            if (result > 0) {
                $("#Report_"+id).css('color','red');
            } else {
                $("#Report_"+id).css('color','black');
            }
        },
        error: function (xhr, ajaxOptions, error) {
            $("#errorAlert").css('display','block');
        }
    });
}
//#endregion

function calculate_time_zone() {
    var rightNow = new Date();
    var jan1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);  // jan 1st
    var june1 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0); // june 1st
    var temp = jan1.toGMTString();
    var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
    temp = june1.toGMTString();
    var june2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
    var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
    var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60);
    var dst;
    if (std_time_offset == daylight_time_offset) {
        dst = "0"; // daylight savings time is NOT observed
    } else {
        // positive is southern, negative is northern hemisphere
        var hemisphere = std_time_offset - daylight_time_offset;
        if (hemisphere >= 0)
            std_time_offset = daylight_time_offset;
        dst = "1"; // daylight savings time is observed
    }
    return convert(std_time_offset);
}

function convert(value) {
    var hours = parseInt(value);
    value -= parseInt(value);
    value *= 60;
    var mins = parseInt(value);
    value -= parseInt(value);
    value *= 60;
    var secs = parseInt(value);
    var display_hours = hours;
    // handle GMT case (00:00)
    if (hours == 0) {
        display_hours = "00";
    } else if (hours > 0) {
        // add a plus sign and perhaps an extra 0
        display_hours = (hours < 10) ? "+0"+hours : "+"+hours;
    } else {
        // add an extra 0 if needed
        display_hours = (hours > -10) ? "-0"+Math.abs(hours) : hours;
    }
    mins = (mins < 10) ? "0"+mins : mins;
    return "GMT"+display_hours+mins;
}



//#region Funcion para crear las tarjetas en la vista
function generateCardofInfopieces(url){
    moment.locale("es");
    var compareDate= null;
    $.ajax({
        beforeSend: function()
        {
            $("#ajaxloading").css('display','block');
            $("#errorCards").text(" ");


        },
        url: url,
        cache: false,
        async: false,
        success: function (result) {
            var obj = JSON.parse(result);
            var htmlRSSContent = $('#frameCardsInfopieces').html();
            for (var i in obj.data) {

                var dataObj = obj.data[i], url = dataObj[0], type = dataObj[4], datePiece=dataObj[2], title=dataObj[5], content=dataObj[1], time=dataObj[3] , sourceName=dataObj[7];
                var source=type, category=dataObj[6],slugline;

                var dateInfopiece = moment(String(datePiece),'dddd DD MMMM YYYY').format('DD-MM-YYYY');

                if(compareDate == null){
                    compareDate=dateInfopiece;
                    htmlRSSContent = htmlRSSContent + '<div class="col m12 left-align fecha-divisor"><span class="col m3 s3 l3" id="fecha">'+ dataObj[2] +'</span><span class="col m9 s9 9 linea derecha "><hr></hr></span></div>';
                }
                if(dateInfopiece != compareDate){
                    htmlRSSContent = htmlRSSContent + '<div class="col m12 left-align fecha-divisor"><span class="col m3 s3 l3" id="fecha">'+ dataObj[2] +'</span><span class="col m9 s9 9 linea derecha "><hr></hr></span></div>';
                }

                if(dataObj[4] == "Twitter"){
                    type=type;
                    source=dataObj[4];
                    slugline=content;

                    }else if(dataObj[0].indexOf("http") != -1){
                        type="RSS";
                        slugline=title;

                        }else{
                            type="Cable";
                            category=type;
                            slugline=title;
                        }

                htmlRSSContent = htmlRSSContent + " <div id='cardOfInfopiece' class='card piezas z-depth-3' data-source='" + source + "' data-title='" + title + "' data-content='" + content + "' data-time='" + time + "' data-newstype='" + type + "' data-url='" + url + "' onclick='openTab(this)' >" +
                    '<div class="card-action">' +
                    '<div class="col s6 m6 l6 card-data">' +
                    '<div class="col s3 m3 l3 valign-wrapper center-align time"><p>' + time + '</p></div>' +
                    '<div class="col s1 m1 l1 valign-wrapper center-align source"><p>' + source + '</p></div>' +
                    '<div class="col s1 m1 l1 valign-wrapper center-align category"><p>'+category+'</p>' +
                    '</div></div></div><div class="card-content white-text"><span class="card-title">'+ sourceName + title +'</span>' +
                    '<p>' + slugline + '</p>' +
                    '</div></div>';

                compareDate=dateInfopiece;

            }
            $('#frameCardsInfopieces').html(htmlRSSContent);
            $("#lastSearch").val((obj.custom).toString());

            /**********Asignarle un id a la pestaña nueva ****/

            if (obj.newSearchTab != null){
                var tabRef = $("a[id^=search]");
                tabRef.attr("id", obj.newSearchTab);

                var tabRef_em = $("em[id^=news]");
                tabRef_em.attr("id", "news_"+obj.newSearchTab);

                var tabRef_buttonReport = $("button[id^=Report_search_]");
                tabRef_buttonReport.attr("id", "Report_"+obj.newSearchTab);

                var tabRef_buttonAlert = $("button[id^=Alert_search_]");
                tabRef_buttonAlert.attr("id", "Alert_"+obj.newSearchTab);
            }

            /************************** ******************************/

            $("#ajaxloading").css('display','none');
        },
        error: function (xhr, ajaxOptions, error) {
            $("#ajaxloading").css('display','none');
            $("#frameCardsInfopieces").load("/error/cards");
        }
    });
}

//#endregion Funcion para crear las tarjetas en la vista

function openTab(obj) {
    var type = $(obj).data('newstype');
    var url = $(obj).data('url');
    var time = $(obj).data('time');
    var content = $(obj).data('content');
    var title = $(obj).data('title');
    var source = $(obj).data('source');

    $("#datos-pieza span").text(url);
    parseInfopiece = String(content.split("  ").join("")).replace(/[.]/gi, ".<br/>");
    $(".contentInfopieces p.bodyInfopieces").html(parseInfopiece);
    $(".contentInfopieces p.bodyInfopieces").html(parseInfopiece);
    $(".contentInfopieces b.titleInfopieces").text(title);

    if (type.toLowerCase() == "twitter".toLowerCase()) {
        var htmlTwitterContent = '<blockquote class="twitter-tweet" data-lang="es"><p lang="es" dir="ltr"></p><a href="' + url + '"></a></blockquote>';
        $('#frameContentTwitter').html(htmlTwitterContent);
        $(".url-pieza a.twitter").text(url);
        $(".url-pieza a.twitter").attr("href", url);

        twttr.widgets.load();

        $('#myModalNetworksTwitter').modal('open');
    } else {
        var htmlRSSContent;
        if(type.indexOf("RSS") != -1){
            htmlRSSContent = '<iframe width="50%" height="50%" frameborder="0" scrolling="yes" allowtransparency="true" src="' + url + '"></iframe>';
            $('#frameContent').html(htmlRSSContent);

            $(".url-pieza a.piece").text(url);
            $(".url-pieza a.piece").attr("href", url);

            $('#myModalNetworks').modal('open');
        }else{
            htmlRSSContent = '<div class="col m12 contentInfopieces"><h2><b class="titleInfopieces">'+title+'</b></h2><p class="bodyInfopieces">'+parseInfopiece+'</p></div>';
            $('#frameContentCables').html(htmlRSSContent);

            $(".url-pieza a.piece").text(source + " |  CABLE");

            $('#myModalNetworksCables').modal('open');
        }

    }
}

//#region Funcion para tomar las agencias tildadas
function getAgencies() {
    var listAgencies = "";
    $('.checkboxes input:checked').each(function () {
        if (!listAgencies) {
            listAgencies = $(this).attr('value');
        } else {
            listAgencies += ',' + $(this).attr('value');
        }
    });
    if (!listAgencies) {
        listAgencies = "null";
    }
    return listAgencies;
}
//#endregion


//#region Funcion para mostrar piezas Nuevas

function contador() {
    var listAgencies = getAgencies();
    var URLactual = window.location.pathname;
    var fields = URLactual.split('/');
    var idRss = 0;
    var idMedia = 0;

    if (fields[2] != null) {
        idMedia = fields[2];
        idRss = fields[3];
    }

    $(".tab-search").each(function (index, ele) {

        var id = $(ele).attr('id');
        var value = $(ele).attr('value');

        var urlendpoint = "/searchChanges/" + idMedia + "/" + idRss + "/" + listAgencies + "/" + id + "/" + value;
        $.ajax({
            url: urlendpoint,
            cache: false,
            async: false,
            success: function (result) {
                if (result > 0) {
                    var split = String(id).split("_");
                    if (split[1] != null) {
                        $("#news_search_"+split[1]).css('display','block');
                    } else {
                        $("#news_".concat(id)).css('display', 'block');
                    }
                }
            },
            error: function (xhr, ajaxOptions, error) {
                clearSearchScoutInterval();
            }
        });
    })
}
//#endregion


function addBusqueda(busqueda, fromTagCloud){
    // <![CDATA[
    var exists = false;
    if(busqueda) {
        var activeSearch = $("#selected_tab").val();

        if(activeSearch && fromTagCloud) {
            //Hay una pestaña seleccionada
            var URLactual = window.location.pathname;
            var fields = URLactual.split('/');
            var idRss = 0;
            var idMedia = 0;

            if (fields[2] != null ) {
                idMedia = fields[2];
                idRss = fields[3];
            }

            busqueda = activeSearch + " AND " + busqueda;

            $('.tab-search').each(function () {
                var value = $(this).attr("value");

                if (value == activeSearch) {
                    //pestaña con la busqueda seleccionada
                    var busquedaAct = $(this).attr("id");
                    var urlendpoint = "/search/" + busquedaAct + "/" + activeSearch + "/" + busqueda + "/" + idMedia + "/" + idRss;
                    var selected_tab = $("#"+busquedaAct+".tab-search");
                    $.ajax({
                        url: urlendpoint,
                        cache: false,
                        async: false,
                        success: function () {
                            $(selected_tab).attr("value", busqueda);
                            $(selected_tab).html(busqueda);
                            $(selected_tab).click();
                            $("#selected_tab").val(busqueda);
                            $("#moreSearch").val(busqueda);
                        },
                        error: function (xhr, ajaxOptions, error) {
                            $("#errorSearchInfopieces").css('display','block');
                        }
                    });
                }
            });

        } else {

            //No hay una pestaña seleccionada

            $('.tab-search').each(function () {
                var value = $(this).attr("value");

                if (value == busqueda) {
                    exists = true;
                } else {
                    exists = false;
                }

                if(exists){
                    $(this).click();
                    return false;
                }
            });

            if (!exists) {
                var URLactual = window.location.pathname;
                var fields = URLactual.split('/');
                var idMedia =0;
                var idRss =0;
                if (fields[2] != null){
                    idMedia =fields[2];
                    idRss =fields[3];
                }
                var id = $(".tab-search").val(busqueda).attr('id');
                $('#tabs-swipe-demo').append('<li class="tab"><a class="tab-search" value="' + busqueda + '" onclick="todos(id)" id="search_' + id + '" data-categoryMedia="' + idMedia + '" data-categoryRSS="' + idRss + '" >' + busqueda + '</a><span onclick="closeTab(this)" > x </span><em id="news_search_' + id + '" class="label label-danger" >+</em></li>')
            } else {
               $('#search-box').val('');
            }
            $("#search_"+id).click();

        }
    } else {
        $(".bd-example-modal-sm").effect("shake");
    }
    // ]]>
}

function clearSearchScoutInterval (){
    if(searchScoutInterval==null){
        for(var i=1; i<searchScoutInterval; i++){
            window.clearInterval(i);
        }
    }
}
