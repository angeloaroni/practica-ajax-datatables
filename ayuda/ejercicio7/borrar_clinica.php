<?php

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
//$_REQUEST['id_clinica'] = 1;
if (isset($_REQUEST['id_clinica'])) {
    // param was set in the query string
    if (empty($_REQUEST['id_clinica'])) {
        return "El parámetro id_clinica viene vacio!";
    }
    $id_clinica = $_REQUEST['id_clinica'];
}

/*
 * SQL queries
 * Get data to display
 */
$query = "delete from clinicas where id_clinica=" . $id_clinica;
$query_res = mysql_query($query);

// Comprobar el resultado
if (!$query_res) {
    if (mysql_errno() == 1451) {
        $mensaje = "Imposible borrar la clínica, tiene doctores definidos. Borre primero los doctores";
        $estado = mysql_errno();
    } else {
        $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
        $estado = mysql_errno();
    }
} else {
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
