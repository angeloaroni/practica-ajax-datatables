   'use strict';
   var miTabla;
   $(document).ready(function() {
       miTabla = $('#miTabla').DataTable({
           'processing': true,
           'serverSide': true,
           'ajax': 'http://www.futbolistas.com/server_processing.php',
           'columns': [
            { 'data': 'idClinica',
              'visible':false 
            },
            { 'data': 'nombre' },
            { 'data': 'razonSocial' },
            { 'data': 'cif' },
            { 'data': 'localidad' },
            { 'data': 'provincia' },
            { 'data': 'direccion' },
            { 'data': 'numCliente' },
            { 'data': 'idTarifa',
              'visible':false
            },
            { 'data': 'nombreTarifa' },
            {
            'data': 'idClinica',
               'render': function(data) {
                   return '<a class="btn btn-primary editarbtn" href=http://www.futbolistas.com/php/editar.php?id_clinica=' + data + '>Editar</a><a class="btn btn-warning borrarbtn" href=http://www.futbolistas.com/php/borrar.php?id_clinica=' + data + '>Borrar</a>';
               }
             }  
        ],
           'language': {
               'sProcessing': 'Procesando...',
               'sLengthMenu': 'Mostrar _MENU_ registros',
               'sZeroRecords': 'No se encontraron resultados',
               'sEmptyTable': 'Ningún dato disponible en esta tabla',
               'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
               'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
               'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
               'sInfoPostFix': '',
               'sSearch': 'Buscar:',
               'sUrl': '',
               'sInfoThousands': ',',
               'sLoadingRecords': 'Cargando...',
               'oPaginate': {
                   'sFirst': 'Primero',
                   'sLast': 'Último',
                   'sNext': 'Siguiente',
                   'sPrevious': 'Anterior'
               },
               'oAria': {
                   'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                   'sSortDescending': ': Activar para ordenar la columna de manera descendente'
               }
           }
       });
        //boton editar
       $('#miTabla').on('click', '.editarbtn', function(e) {
           e.preventDefault();
           $('#tabla').fadeOut(100);//oculta tabla (los row del html)
           $('#formulario').fadeIn(100);//muestra formulario (los row del html)

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#idClinica').val(aData.idClinica);
           $('#nombre').val(aData.nombre);
           $('#numClinica').val(aData.numClinica);
           $('#razonSocial').val(aData.razonSocial);
           $('#cif').val(aData.cif);
           $('#localidad').val(aData.localidad);
           /*lo más cómodo para la provincia sería esto:
           $('#provincia').val(aData.provincia);
           pero como el valor de la provincia viene con digitos en el html (atributo val), tenemos que selecionar por el texto contenido:*/
           $('#provincia option').filter(function() {
               return this.text.toLowerCase() === aData.provincia.toLowerCase();
           }).attr('selected', true);
           $('#direccion').val(aData.direccion);
           $('#cp').val(aData.cp);
       });
        //boton borrar
       $('#miTabla').on('click', '.borrarbtn', function(e) {
           e.preventDefault();

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           var idClinica = aData.idClinica; 
           $.ajax({
             url: 'http://www.futbolistas.com/borrar_clinica.php',
             type: 'GET',
             dataType: 'json',
             data: {'id_clinica': idClinica},
           })
           .done(function() {
              var $mitabla =  $('#miTabla').dataTable( {
                   bRetrieve : true 
              });
              $mitabla.fnDraw();
              console.log('Se ha borrado la clinica'+ aData.nombre);

           })
           .fail(function() {
             console.log('error al borrar la clinica');
           });
           
       }); 

       /*Cargamos los datos para las tarifas:*/
       function cargarTarifas() {
           $.ajax({
               type: 'GET',
               dataType: 'json',
               url: 'http://www.futbolistas.com/listar_tarifas.php'
               //estos son los datos que queremos actualizar, en json:
               // {parametro1: valor1, parametro2, valor2, ….}
               //data: { id_clinica: id_clinica, nombre: nombre, ….,  id_tarifa: id_tarifa },
            })
            .done(function(data) {
                   $('#idTarifa').empty();
                   $.each(data, function() {
                       $('#idTarifa').append(
                           $('<option></option>').val(this.id_tarifa).html(this.nombre)
                       );
                   });
            })
           .fail(function() {
                   console.log('ha habido un erro al obtener el obejeto');
       });
               
           
       }
       cargarTarifas();
      //mandar los datos editados
      $('#enviar').click(function(e) {
           e.preventDefault();
           var idClinica = $('#idClinica').val();
           var nombre = $('#nombre').val();
           var localidad = $('#localidad').val();
           var provincia = $('#provincia option:selected').text();
           var direccion = $('#direccion').val();
           var cif = $('#cif').val();
           var cp = $('#cp').val();
           var id_tarifa = $('#idTarifa').val();
           $.ajax({
                   url: 'http://www.futbolistas.com/modificar_clinica.php',
                   type: 'POST',
                   dataType: 'json',
                   data: {
                       id_clinica: idClinica,
                       nombre: nombre,
                       localidad: localidad,
                       provincia: provincia,
                       direccion: direccion,
                       cp: cp,
                       id_tarifa: id_tarifa,
                       cif: cif
                   },
               })
               .done(function() {
                   var $mitabla = $('#miTabla').dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
               })
               .fail(function() {
                   console.log('error');
               })
               .always(function() {
                   $('#tabla').fadeIn(100);
                   $('#formulario').fadeOut(100);
               });

       });
   });
