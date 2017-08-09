/**
 * Conmuta la visibilidad del contenido, oculta un div y muestra el otro, y
 * viceversa.
 *
 * @param {div, div} ul elemento que contiene a los list-group-item.
 */
function toggleBtns($div1, $div2){
    if ($div1.css('display') == "none") {
        $div1.show();
        $div2.hide();
    } else if ($div2.css('display') == "none") {
        $div2.show();
        $div1.hide();
    }
}

/**
 * Inserta una fila de de input text envueltos en un li.list-group-item para
 * que sean ingresado los resultados de cada examen.
 *
 * @param {Element} ul elemento que contiene a los list-group-item.
 */
function insertTextInputs($ul) {
    var $listItem = $('<li class="list-group-item inputs">');
    $listItem.append(`
        <div class="row">
            <div class="col-xs-3">
                <input type="text" name="parametro" placeholder="ingrese datos" class="inputResutlts" required="">
            </div>
            <div class="col-xs-3">
                <input type="text" name="unidad" placeholder="ingrese datos" value="%" class="inputResutlts" required="">
            </div>
            <div class="col-xs-3">
                <input type="text" name="resultado" placeholder="ingrese datos" class="inputResutlts" required="">
            </div>
            <div class="col-xs-3">
                <input type="text" name="val_ref" placeholder="ingrese datos" class="inputResutlts" required="">
            </div>
        </div> `)
    var btnRemove = $(this)
    var $btnRemove = $('<a href="#" class="btnRemove">');
    $btnRemove.css({
        "position": "absolute",
        "right": "12px",
        "top": "19px",
        "color": "#d9534f"
    });;
    $btnRemove.append('<span class="fa fa-times fa-lg"/>');
    $listItem.append($btnRemove);
    $ul.append($listItem);
};

/**
 * Recorre todos los panels de examenes para generar un json con los resultados
 * de cada examen de la muestra.
 *
 * @return JSON con los valores de los resultados.
 */
function getJsonFromPanelExams(){
    var examenesResults = [];
    $(".examenes.panel").each(function(index, examenPanel) {
        var resultados = $(examenPanel).find('.list-group-item.inputs');
        var examenResults = []
        $(resultados).each(function(index, liGroupItemInput) {
            var param = $(liGroupItemInput).find('[name="parametro"]').val();
            var unidad = $(liGroupItemInput).find('[name="unidad"]').val();
            var resultado = $(liGroupItemInput).find('[name="resultado"]').val();
            var val_ref = $(liGroupItemInput).find('[name="val_ref"]').val();
            if (param==="" || unidad==="" || resultado==="" || val_ref==="") {
                // alert('alguno sin ingresar');
                return "incompleto";
            }
            var paramResults = {
                parametro: param,
                unidad: unidad,
                resultado: resultado,
                val_ref: val_ref
            }
            examenResults.push(paramResults);
        });
        examenesResults.push({resultados: examenResults});
    });
    return examenesResults;
}

$(document).ready(function() {

    $(document).on('click', '#notificar', function(event) {
        event.preventDefault();
        $("#estado-group").hide();
        $("#estadoRadios").show();
    });
    $("#cancelar").click(function(event) {
        $("#estado-group").show();
        $("#estadoRadios").hide();
    });

    //actualiza la muestra->stado en el backend
    $("#guardar-notif").click(function(event) {
        var inputEstado = $('input[name=optionsRadios]:checked').val();
        var muestra_id = $("#muestra_id").val();
        $.ajax({
            url: "/muestras/resultados/"+muestra_id,
            type: 'PUT',
            data: {
                estado: inputEstado
            },
            success: function(response) {
                $("#estado").val(response.estado);
                $("#estado-group").show();
                $("#estadoRadios").hide();
            }
        });
    });

    // Button ingresar resultados de examenes
    $("#ingresarResults").click(function(event) {
        event.preventDefault();
        //llena con text inputs
        $(".examenes.panel").each(function(index, examenPanel) {
            var $examenHead = $(examenPanel).children('.panel-heading');
            var $btnAdd = $('<a href="#" class="btnAdd"/>').css({
                "position": "absolute",
                "right": "10px",
                "top": "5px",
                "color": "#89bf00",
                "z-index": "999"
            });;
            $btnAdd.append('<span class="fa fa-plus-circle fa-2x"/>');
            $examenHead.append($btnAdd);
            var $ulGroup = $(examenPanel).children('.list-group');
            insertTextInputs($ulGroup);
        });
        // cambia el boton ingresar por cancelar&guardar
        toggleBtns($("#ingResults-group1"), $("#ingResults-group2"));
    });

    // Button cancelar ingreso de resultados
    $("#cancelarResults").click(function(event) {
        $(".examenes.panel").each(function(index, examenPanel) {
            var $examenHead = $(examenPanel).children('.panel-heading');
            $examenHead.children('a.btnAdd').remove();
            // Remueve los inputs
            $('.list-group-item.inputs').each(function(index, listItem) {
                $(listItem).remove();
            });
        });
        // cambia botones cancelar&guardar por button ingresar
        toggleBtns($("#ingResults-group1"), $("#ingResults-group2"));
    });

    // Button guardar resultados ingresados
    $("#guardarResults").click(function(event) {
        var mResultados = getJsonFromPanelExams();
        if (mResultados === "incompleto") {
            // algun campo no fue llenado
            // alert('algun campo no fue llenado');
        } else {
            console.log(mResultados);
            // alert('todos ingresados');
            var muestra_id = $("#muestra_id").val();
            var ajaxRequest = $.ajax({
                url: "/muestras/resultados/"+muestra_id,
                type: 'PUT',
                data: {muestraResults: mResultados},
                dataType: 'json',
                success: function(data){
                    location.reload();
                },
                error: function (xhr) {
                    var alMjs = xhr.responseJSON;
                    console.log(alMjs);
                    // alert(alMjs);
                    window.location = "#";
                }
            });
        }
    });

    //agregar una fila de resultados
    $(document).on('click', 'a.btnAdd', function(event) {
        event.preventDefault();
        var $examenPanel = $(this).parent().parent();
        var $ulGroupSibling = $examenPanel.children('.list-group');
        insertTextInputs($ulGroupSibling);
    });

    //remover una fila de parametros
    $(document).on('click', 'a.btnRemove', function(event) {
        event.preventDefault();
        $(this).parent().remove();
    });
});
