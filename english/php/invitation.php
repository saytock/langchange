<?php
header("Content-type:text/plain;charset=UTF-8");

session_destroy();
session_start();

$_SESSION["invitation"] = $_GET["invitation"];
$_SESSION["checkRegister"] = "register-2";

$redirect='../register-2.html';
header('Location:'.$redirect);


?>
