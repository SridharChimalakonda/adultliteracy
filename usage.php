<?php

$str = $_SERVER['REMOTE_ADDR'].'|'.$_POST['client_id'].'|'.json_encode($_POST['clicks']).'
';
$fp = fopen('clicks.log', 'a');
fwrite($fp, $str);
fclose($fp);
