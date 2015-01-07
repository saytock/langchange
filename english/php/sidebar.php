<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

//セッションを始める
session_start();

$query = $pdo->query("SELECT * FROM users WHERE id = '".$_SESSION["id"]."'");
$rows=$query->fetch(PDO::FETCH_ASSOC);

//ユーザー名を取得
$_SESSION["ticket"] = $rows["ticket"];
$checkImageFlag="https://";
$checkImage = strpos($rows["image"],$checkImageFlag);
if($checkImage === false)
$image = "prof/".$rows["image"];
else
$image = $rows["image"];

$tmp = "<center><img class='img-responsive'  src='".$image."' width='160px' height='auto'/></center>,<h2 style='text-align:center'>".$rows["name"]." </h2>,".$rows["ticket"]."coins"./*<button onClick='toPayPal()'>Purchase</button>*/",".$_SESSION["friends"]."friends,".$rows["nation"].",".$rows["sex"].",".$rows["birthday"].",".$rows["hobby"].",".$_SESSION["id"].",".$rows["serching"].",";


//紹介LCコイン取得確認
if($rows["invticket"]>0){
	$pdo->query("UPDATE users SET invticket = 0 WHERE id ='".$_SESSION["id"]."'");
	$tmp .= " ".$rows["invticket"]." people registered your invitation code.\n\n You got ".$rows["invticket"]." LC coins.";
}

echo $tmp;

?>
