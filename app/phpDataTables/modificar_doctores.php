<?php
header("access-control-allow-origin: *");
/* Database connection information */
include("mysql.php" );



/*
 * Local functions
 */

function fatal_error($sErrorMessage = '') {
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
    die($sErrorMessage);
}

/*
 * MySQL connection
 */
if (!$gaSql['link'] = mysql_pconnect($gaSql['server'], $gaSql['user'], $gaSql['password'])) {
    fatal_error('Could not open connection to server');
}

if (!mysql_select_db($gaSql['db'], $gaSql['link'])) {
    fatal_error('Could not select database ');
}

mysql_query('SET names utf8');



/*
 * SQL queries
 * Get data to display
 */

$id = $_POST["id_doctor"];
$nombre = $_POST["nombre"];
$numcolegiado = $_POST["numcolegiado"];
$clinicas = $_POST["clinicas"];

if($clinicas){
  $query = "DELETE FROM clinica_doctor WHERE id_doctor=" . $id;
  $query_res = mysql_query($query);
}
for ($i=0;$i<count($clinicas);$i++)
{
  $queryCD = "INSERT INTO clinica_doctor (id_doctor,id_clinica) VALUES(
    ". $id . ",
    " . $clinicas[$i] . ")" ;
  $query_res = mysql_query($queryCD);
}



/* Consulta UPDATE */
$query = "UPDATE doctores SET 
            nombre = '" . $nombre . "',             
            numcolegiado = '" . $numcolegiado . "'
            WHERE id_doctor = " . $id;

//mysql_query($query, $gaSql['link']) or fatal_error('MySQL Error: ' . mysql_errno());
/*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
$query_res = mysql_query($query);

// Comprobar el resultado
if (!$query_res) {
    $mensaje  = 'Error en la consulta: ' . mysql_error() . "\n";
    $estado = mysql_errno();
}
else
{
    $mensaje = "Actualización correcta";
    $estado = 0;
}
$resultado = array();
 $resultado[] = array(
      'mensaje' => $mensaje,
      'estado' => $estado
   );
echo json_encode($resultado);
?>
