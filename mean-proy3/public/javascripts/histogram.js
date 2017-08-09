
$(function() {
  $("#fec-desde").datepicker({ dateFormat: 'dd-mm-yy' });
  $("#fec-hasta").datepicker({ dateFormat: 'dd-mm-yy' });
});

function definirRangosBusqueda() {
  var pri_reporte = document.getElementById("pri-reporte");
  if (pri_reporte.checked) {
    $("#acordeon").hide(1000);
  }else {      
    $("#acordeon").show(1000);
  }  
}

function aleatorio(inferior, superior) {
  numPosibilidades = superior - inferior;
  aleat = Math.random() * numPosibilidades;
  aleat = Math.floor(aleat);
  return parseInt(inferior) + aleat;
}

function colorAleatorio() {
  var hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");
  color_aleatorio = "#";
  for (i=0; i<6; i++) {
    posarray = aleatorio(0, hexadecimal.length);
    color_aleatorio += hexadecimal[posarray];
  }
  return color_aleatorio;
}

function listaColoresAleatorios(dimension) {
  var listaColores = [];
  var color = colorAleatorio();

  for (var i = 0; i < dimension; i++) {
    listaColores.push(color);
  }

  return listaColores;
}

function nombresLaboratorios() {
  var url = '/laboratorios';
  $.ajax({
    type: 'GET',
    url: url,
    success: function(laboratorios) {         
      $.each(laboratorios, function(i, item) {        
        total.push(item.nombre);        
      });      
    }    
  });  
}

function obtenerRangoFechas() {
  var fechaDesde = $('#fec-desde').val().split('-');
  var fechaHasta = $('#fec-hasta').val().split('-');
  fechaDesde = new Date(String(fechaDesde[1]) + '/' + String(fechaDesde[0]) + '/' + String(fechaDesde[2]));
  fechaHasta = new Date(String(fechaHasta[1]) + '/' + String(fechaHasta[0]) + '/' + String(fechaHasta[2]));
  console.log('f desde: ' + fechaDesde);
  console.log('f hasta: ' + fechaHasta);  
  var fechaTemporal = fechaDesde;
  var label = [];

  while(fechaTemporal <= fechaHasta) {    
    var mes = fechaTemporal.getMonth() + 1;
    var año = fechaTemporal.getFullYear();

    if (mes < 10) {
      label.push('0' + String(mes) + '-' + año);
    }else {
      label.push(String(mes) + '-' + año);
    }

    if ((Number(mes) + 1) >= 13) {
      mes = 1;
      año = Number(año) + 1;
    }else {
      mes = Number(mes) + 1;
    }

    if (mes < 10) {
      fechaTemporal = new Date(String('0' + mes + '/01' + '/' + año));
    }else {
      fechaTemporal = new Date(String(mes + '/01/' + año));
    }    
  }
  return label;
}

function obtenerListaInformacionXLaboratorio(lista) {
  var items = [];
  var fecha;

  for (var i = 0; i < lista.length; i++) {
    fecha = lista[i];
    console.log({fecha: fecha, valor: 0});
    items.push({fecha: fecha, valor: 0});
  }

  return items;
}

function reporteEstadisticoPastel() {
  var url1 = '/laboratorios';
  var url2 = '/muestras';
  $.ajax({
    type: 'GET',
    url: url1,
    success: function(laboratorios) {
      $.ajax({
        type: 'GET',
        url: url2,
        success: function(muestras) {
          var muestrasXLaboratorio = [];
          var nombresLab = [];          
          var datos = [];
          var datos_principales = [];
          var datasets = [];
          var juego_colores = [];
          var contador = 0;          
          $.each(laboratorios, function(i, laboratorio) {
            nombresLab.push(laboratorio.nombre);
          });

          $.each(nombresLab, function(j, nombreLab) {
            $.each(muestras, function(k, muestra) {
              if (muestra.lab_asignado == nombreLab) {
                contador++;
              }
            });

            muestrasXLaboratorio.push(contador);
            contador = 0;
          });

          $.each(nombresLab, function(l, nombreLab) {
            juego_colores.push(colorAleatorio());
          });

          $.each(nombresLab, function(m, nombreLab) {
            datasets.push({
              label: nombreLab,
              data: muestrasXLaboratorio,
              backgroundColor: juego_colores,
              borderColor: juego_colores,
              borderWidth: 1
            });
          });

          data = {
            labels: nombresLab,
            datasets: datasets
          }          

          datos = {
            type: 'pie',
            data: data
          }

          var contexto = document.getElementById("grafico").getContext("2d");
          var chart = new Chart(contexto, datos);
        }
      });
    }
  });
}

function reporteEstadisticoBarra() {
  var url1 = '/laboratorios';
  var url2 = '/muestras';
  $.ajax({
    type:'GET',
    url: url1,
    success: function(laboratorios) {

      $.ajax({
        type:'GET',
        url: url2,
        success: function(muestras) {          
          var nombresLab = [];          
          var datos = [];
          var datos_principales = [];          
          var data = [];
          var datasets = [];
          var labels = [];
          var rangoFechas = obtenerRangoFechas();          
          var fechaDesde = $('#fec-desde').val().split('-');
          var fechaHasta = $('#fec-hasta').val().split('-');          
          fechaDesde = new Date(String(fechaDesde[1]) + '/' + String(fechaDesde[0]) + '/' + String(fechaDesde[2]));
          fechaHasta = new Date(String(fechaHasta[1]) + '/' + String(fechaHasta[0]) + '/' + String(fechaHasta[2]));

          $.each(laboratorios, function(i, laboratorio) {
            nombresLab.push(laboratorio.nombre);
          });

          $.each(nombresLab, function(j, nombreLab) {
            var datosXLaboratorio = [];
            var color = colorAleatorio();            
            var informacionXLaboratorio = obtenerListaInformacionXLaboratorio(rangoFechas);            

            $.each(muestras, function(k, muestra) {
              if (muestra.lab_asignado == nombreLab) {                              
                var fechaMuestra = new Date(muestra.fechaIngreso);                                
                var mesMuestra = Number(fechaMuestra.getMonth() + 1);
                var añoMuestra = Number(fechaMuestra.getFullYear());

                if ((fechaMuestra >= fechaDesde) && (fechaMuestra <= fechaHasta )) {
                  for(var pos = 0; pos < informacionXLaboratorio.length; pos++) {
                    if (mesMuestra < 10) {
                      if (informacionXLaboratorio[pos].fecha == String('0' + mesMuestra  + '-' + añoMuestra)) {
                        informacionXLaboratorio[pos].valor++;
                      }
                    }else {
                      if (informacionXLaboratorio[pos].fecha == String(mesMuestra  + '-' + añoMuestra)) {
                        informacionXLaboratorio[pos].valor++;
                      }
                    }
                  }
                }
              }
            });

            for(var pos = 0; pos < informacionXLaboratorio.length; pos++) {
              console.log('Datos de ' + nombreLab + ': ' + informacionXLaboratorio[pos].valor);
              datosXLaboratorio.push(informacionXLaboratorio[pos].valor);
            }

            var listaColores = listaColoresAleatorios(datosXLaboratorio.length);

            datasets.push({
              label: nombreLab,
              data: datosXLaboratorio,
              backgroundColor: listaColores,
              borderColor: listaColores,
              borderWidth: 1
            });

          });          
          datos_principales = {              
            labels: rangoFechas,
            datasets: datasets
          }

          datos = {
            type: 'bar',            
            data: datos_principales
          }

          var contexto = document.getElementById('grafico').getContext('2d');
          var chart = new Chart(contexto, datos);         
        }
      });
    }
  });  
}

$("#boton").click(function() {
  var rep = document.getElementById("grafico");
  rep.parentNode.removeChild(rep);
  var pri_reporte = document.getElementById("pri-reporte");
  var graph = document.getElementById("graph");
  rep = document.createElement("canvas");
  rep.id = "grafico";
  graph.appendChild(rep);

  if (pri_reporte.checked) {
    reporteEstadisticoPastel();
  }else {
    reporteEstadisticoBarra();
  }
  return false;
});

$(document).ready(function() {
  var rep = document.getElementById("grafico");
  rep.parentNode.removeChild(rep);
  var pri_reporte = document.getElementById("pri-reporte");
  var graph = document.getElementById("graph");
  rep = document.createElement("canvas");
  rep.id = "grafico";
  graph.appendChild(rep);

  if (pri_reporte.checked) {
    reporteEstadisticoPastel();
  }else {
    reporteEstadisticoBarra();
  }
  return false;
});
