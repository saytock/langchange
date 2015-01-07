<?php
header("Content-type:text/plain;charset=UTF-8");

//セッションを始める
session_start();

//ビデオ開始情報記録
if(isset($_POST["langVideo"])){
$_SESSION["langVideo"] = "on";
$_SESSION["tillHour"] = $_POST["tillHour"];
$_SESSION["tillMinute"] = $_POST["tillMinute"];

echo "";
}

//トーク中かチェック
if(isset($_POST["checkVideo"]))
echo $_SESSION["tillHour"].",".$_SESSION["tillMinute"].",".$_SESSION["room"];

//トークの終了
if($_POST["endVideo"]=="end"){
$_SESSION["langVideo"] = "";
$_SESSION["tillHour"] = "";
$_SESSION["tillMinute"] = "";

echo "end";
}	

?>
