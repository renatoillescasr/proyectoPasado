
function fileSelected() {

    var oFile = document.getElementById('image_file').files[0];
    var oImage = document.getElementById('preview');
    // prepare HTML5 FileReader
    var oReader = new FileReader();
    oReader.onload = function(e) {
        // e.target.result contains the DataURL which we will use as a source of the image
        oImage.src = e.target.result;
    };
    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
    var vFD = new FormData(document.getElementById('upload_form'));
}

$(document).ready(function() {


        $('input#ced.form-control').attr('disabled', true);




    var listaTelefonos = $('<ul class="list-inline"></ul>');

    $.getJSON("/pacientes", function(jsonResp) {
        jsonResp.forEach(function(item) {

            $('input#nombre.form-control').attr("value", item.nombres);
            $('input#apellido.form-control').attr("value", item.apellidos);
            $('input#ced.form-control').attr("value", item.cedula);
            item.telefonos.forEach(function(item) {
                var telefono = $('<input type="text" onkeypress="return valida(event)" maxlength="10"  minlength="7" name="telefono" class="form-control" id="telf" placeholder="Teléfono"></input>');
                telefono.attr("value", item);
                listaTelefonos.append(telefono);
            })

            $("#telefonos").append(listaTelefonos);
            $('input#dir.form-control').attr("value", item.direccion);

            $('input#telf.form-control').attr("value", item.telefono);

            $('input#inputEmail3.form-control').attr("value", item.correo);
            $('img#preview').attr("src", item.foto);
        })
    })
})
