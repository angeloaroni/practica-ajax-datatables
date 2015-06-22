   'use strict';
   var miTabla;
   $(document).ready(function() {
       $('#formularioCrear').fadeOut(100);
       miTabla = $('#miTabla').DataTable({
           'processing': true,
           'serverSide': true,
           //'ajax': 'http://www.futbolistas.com/phpDataTables/server_processing.php',
           'ajax': './phpDataTables/server_processing.php',
           'columns': [{
               'data': 'idDoctor',
               'visible': false
           }, {
               'data': 'nombre'
           }, {
               'data': 'numColegiado'
           }, {
               'data': 'idClinica',
               'visible': false
           }, {
               'data': 'nombreClinica'
           }, {
               'data': 'idDoctor',
               'render': function(data) {
                   return '<a class="btn btn-primary editarbtn" href=http://www.futbolistas.com/php/editar.php?id_doctor=' + data + '>Editar</a><a data-toggle="modal" data-target="#basicModal"  class="btn btn-warning borrarbtn" href=http://www.futbolistas.com/php/borrar_doctor.php?id_doctor=' + data + '>Borrar</a>';
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

       //boton editar cargamos datos de doctores
       $('#miTabla').on('click', '.editarbtn', function(e) {
           e.preventDefault();
           $('#tabla').fadeOut(100); //oculta tabla (los row del html)
           $('#formularioCrear').fadeOut(100);
           $('#formulario').fadeIn(100); //muestra formulario (los row del html)

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           $('#idDoctor').val(aData.idDoctor);
           $('#nombre').val(aData.nombre);
           $('#numColegiado').val(aData.numColegiado);
           $('#clinicas').val(aData.clinicas);

       });

       //boton borrar
       $('#miTabla').on('click', '.borrarbtn', function(e) {
           e.preventDefault();

           var nRow = $(this).parents('tr')[0];
           var aData = miTabla.row(nRow).data();
           var idDoctor = aData.idDoctor;
           $.ajax({
               //url: 'http://www.futbolistas.com/phpDataTables/borrar_doctor.php',
               url: './phpDataTables/borrar_doctor.php',
               type: 'GET',
               dataType: 'json',
               data: {
                   'id_doctor': idDoctor
               },
               error: function(xhr, status, error) {
                   $.growl.error({
                       title: 'ERROR',
                       message: 'No se ha podido eliminar al doctor'
                   });
               },
               success: function(data) {
                   var $mitabla = $('#miTabla').dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
                   if (data[0].estado === 0) {
                       $.growl.notice({
                           title: 'OK',
                           message: 'Doctor eliminado correctamente'
                       });
                   }
               },
           });
       });




       //Cargamos nombre de la clinica
       function cargarClinica() {
           $.ajax({
                   type: 'GET',
                   dataType: 'json',
                   //url: 'http://www.futbolistas.com/phpDataTables/listar_clinicas.php'
                   url: './phpDataTables/listar_clinicas.php'
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
                   console.log('ha habido un erro al obtener el objeto');
               });


       }
       cargarClinica();

       /////
       //INICIO FORMULARIO AÑADIR
       $('#enviarDoc').click(function(e) {
           e.preventDefault();
           var nombreNuevo = $('#nombreNuevo').val();
           var numcolegiadoNuevo = $('#numcolegiadoNuevo').val();
           var clinicas2 = $('#clinicas2').val();
           $.ajax({
               type: 'POST',
               dataType: 'json',
               //url: 'http://www.futbolistas.com/phpDataTables/crear_doctor.php',
               url: './phpDataTables/crear_doctor.php',

               data: {
                   nombreNuevo: nombreNuevo,
                   numcolegiadoNuevo: numcolegiadoNuevo,
                   clinicas2: clinicas2

               },
               error: function(xhr, status, error) {

                   $.growl.error({

                       icon: 'glyphicon glyphicon-remove',
                       title: 'ERROR',
                       message: 'Error al añadir el doctor!'
                   });

               },
               success: function(data) {
                   var $mitabla = $('#miTabla').dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
                   if (data[0].estado === 0) {
                       $.growl.notice({
                           icon: 'glyphicon glyphicon-ok',
                           title: 'OK',
                           message: 'Doctor añadido correctamente!'
                       }, {
                           type: 'success'
                       });
                   } else {
                       $.growl.error({
                           icon: 'glyphicon glyphicon-remove',
                           message: 'Error al añadir el doctor!'
                       }, {
                           type: 'danger'
                       });
                   }
               },
               complete: {}
           });
           $('#formularioCrear').fadeOut(100);
           $('#tabla').fadeIn(100);

       });


       /*boton añadir doctor,oculto tabla para mostrar form*/
       $('#nuevoDoctor').click(function(e) {
           e.preventDefault();
           $('#nombreNuevo').val(' ');
           $('#numcolegiadoNuevo').val(' ');
           //oculto tabla muestro form
           $('#tabla').fadeOut(100);
           $('#formularioCrear').fadeIn(100);
           cargarClinicaCrear();

       });


       //INICIO FUNCION CARGARCLINICACREAR
       function cargarClinicaCrear() {
               $.ajax({
                   type: 'POST',
                   dataType: 'json',
                   //url: 'http://www.futbolistas.com/phpDataTables/listar_clinicas.php',
                   url: './phpDataTables/listar_clinicas.php',
                   async: false,

                   error: function(xhr, status, error) {


                   },
                   success: function(data) {
                       $('#clinicas2').empty();
                       $.each(data, function() {
                           $('#clinicas2').append(
                               $('<option ></option>').val(this.id_clinica).html(this.nombre)
                           );
                       });

                   },
                   complete: {

                   }
               });
           }
           ////

       //mandar los datos editados
       $('#enviar').click(function(e) {
           e.preventDefault();
           var idDoctor = $('#idDoctor').val();
           var nombre = $('#nombre').val();
           var numColegiado = $('#numColegiado').val();
           var clinicas = $('#clinicas').val();
           $.ajax({
               //url: 'http://www.futbolistas.com/phpDataTables/modificar_doctores.php',
               url: './phpDataTables/modificar_doctores.php',
               type: 'POST',
               dataType: 'json',
               data: {
                   id_doctor: idDoctor,
                   nombre: nombre,
                   numcolegiado: numColegiado,
                   clinicas: clinicas
               },
               error: function(xhr, status, error) {
                   $.growl.error({
                       title: 'ERROR',
                       message: 'No se ha podido editar el doctor'
                   });
               },
               success: function(data) {
                   var $mitabla = $('#miTabla').dataTable({
                       bRetrieve: true
                   });
                   $mitabla.fnDraw();
                   if (data[0].estado === 0) {
                       $.growl.notice({
                           title: 'OK',
                           message: 'Doctor editado correctamente'
                       });
                   }
               },
           });
           //volvemos habilitar la tabla y el formulario
           $('#tabla').fadeIn(100);
           $('#formulario').fadeOut(100);
           $('#formularioCrear').fadeOut(100);

       });

   });
