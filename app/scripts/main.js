   'use strict';
   var miTabla;
   $(document).ready(function() {
       miTabla = $('#miTabla').DataTable({
           'processing': true,
           'serverSide': true,
           'ajax': 'http://www.futbolistas.com/phpDataTables/server_processing.php',
           'columns': [{
               'data': 'idDoctor',
               'visible': false
           }, {
               'data': 'nombre'
           }, {
               'data': 'numColegiado'
           }, 
            { 'data': 'idClinica',
              'visible':false
            },
            { 'data': 'nombreClinica' },
           {
               'data': 'idDoctor',
               'render': function(data) {
                   return '<a class="btn btn-primary editarbtn" href=http://www.futbolistas.com/php/editar.php?id_doctor=' + data + '>Editar</a><a class="btn btn-warning borrarbtn" href=http://www.futbolistas.com/php/borrar.php?id_doctor=' + data + '>Borrar</a>';
               }
           }],
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
           $('#tabla').fadeOut(100); //oculta tabla (los row del html)
           $('#formulario').fadeIn(100); //muestra formulario (los row del html)

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#idDoctor').val(aData.idDoctor);
           $('#nombre').val(aData.nombre);
           $('#numColegiado').val(aData.numColegiado);
           $('#clinicas').val(aData.clinicas);
           
       });
      
      /*
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
                   data: {
                       'id_clinica': idClinica
                   },
               })
               .done(function() {
                   var $mitabla = $('#miTabla').dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
                   console.log('Se ha borrado la clinica' + aData.nombre);

               })
               .fail(function() {
                   console.log('error al borrar la clinica');
               });

        });
      */
          
       //Cargamos nombre de la clinica
       function cargarClinica() {
           $.ajax({
                   type: 'GET',
                   dataType: 'json',
                   url: 'http://www.futbolistas.com/phpDataTables/listar_clinicas.php'
                       //estos son los datos que queremos actualizar, en json:
                       // {parametro1: valor1, parametro2, valor2, ….}
                       //data: { id_clinica: id_clinica, nombre: nombre, ….,  id_tarifa: id_tarifa },
               })
               .done(function(data) {
                   $('#clinicas').empty();
                   $.each(data, function() {
                       $('#clinicas').append(
                           $('<option></option>').val(this.id_clinica).html(this.nombre)
                       );
                   });
               })
               .fail(function() {
                   console.log('ha habido un erro al obtener el obejeto');
               });


        }       
       cargarClinica();
       
       //mandar los datos editados
       $('#enviar1').click(function(e) {
           e.preventDefault();
           var idDoctor = $('#idDoctor').val();
           var nombre = $('#nombre').val();
           var numcolegiado = $('#nunColegiado').val();
           var clinicas = $('#clinicas').val();
           $.ajax({
                   url: 'http://www.futbolistas.com/phpDataTables/modificar_doctores.php',
                   type: 'POST',
                   dataType: 'json',
                   data: {
                       id_doctor: idDoctor,
                       nombre: nombre,
                       numcolegiado: numColegiado,
                       clinicas: clinicas
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
