<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

//セッションを始める
session_start();

$tmp="";
//履歴を取得する
$query = $pdo->query("SELECT date,image,friendid,name,type FROM history,users WHERE userid = '".$_SESSION["id"]."' && users.id = friendid && checks='c' ORDER BY date DESC" );
while($rows=$query->fetch(PDO::FETCH_ASSOC)){
	$tmp = $tmp.$rows["date"].",".$rows["image"].",".$rows["friendid"].",".$rows["name"].",".$rows["type"].","; 	
}
	
echo $tmp;


?>
