<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

//セッションを始める
session_start();

//ログを取得する
$tmp = "";
//学んだ時間を取得
$query = $pdo->query("SELECT date FROM history WHERE userid = '".$_SESSION["id"]."' && year = '".$_POST["currentYear"]."'  && type='learning' && checks='c' ORDER BY date ASC");
while($rows=$query->fetch(PDO::FETCH_ASSOC)){
	$tmp = $tmp.$rows["date"].","; 	
}

$tmp = $tmp."=,";

//教えた時間を取得
$query = $pdo->query("SELECT date FROM history WHERE userid = '".$_SESSION["id"]."' && year = '".$_POST["currentYear"]."'  && type='teaching' && checks='c' ORDER BY date ASC");
while($rows=$query->fetch(PDO::FETCH_ASSOC)){
	$tmp = $tmp.$rows["date"].","; 	
}

echo $tmp;

?>
