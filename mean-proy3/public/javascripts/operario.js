$(document).ready(function() {
    $("#muestra-create a").hover(function() {
        $(this).css("color", "#000");
        $(this).find(".fa-plus-circle").css({
            "-webkit-transform": "rotateZ(90deg)",
            "transform": "rotateZ(90deg)",
        })
    }, function() {
        $(this).find(".fa-plus-circle").css({
            "-webkit-transform": "rotateZ(0deg)",
            "transform": "rotateZ(0deg)",
        })
        $(this).css("color", "#89bf00");

    });

    $("#tableMuestras").find("th").css("text-align", "center");
    /*$.getJSON('json/muestras.json', function( data ) {
        $(data).each(function(index, item) {
            var $row = $("<tr/>").append($("<td/>").text(index+1));
            $row.append($("<td/>").text(item.paciente));
            $row.append($("<td/>").text(item.enfermedad));
            $row.append($("<td/>").text(item.labDestino));
            $row.append($("<td/>").text("23/12/14"));
            var $btnEdit = $("<button/>").addClass("btn btn-primary btn-sm");
            $btnEdit.append("<span/>").addClass("fa fa-pencil");
            var $btnDelete = $("<button/>").addClass("btn btn-danger btn-sm");
            $btnDelete.append("<span/>").addClass("fa fa-trash");
            var $tdActions = $("<td/>").append($btnEdit, $btnDelete);
            $row.append($tdActions);

            $("#tableMuestras tbody").append($row);
        });
    });*/

    $(document).on("click", "#tableMuestras tbody tr button.btn-danger", function(event) {
        $(this).parent().parent().remove();
    })
});
