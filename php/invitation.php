<?php

session_destroy();
session_start();

$_SESSION["invitation"] = $_GET["invitation"];
$_SESSION["checkRegister"] = "register-2";

if(isset($_SESSION["invitation"])){
$redirect='../register-2.html';
header('Location:'.$redirect);
}
?>

