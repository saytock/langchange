<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

//セッションを始める
session_start();

$tmp="";
//コメントを取得
$query = $pdo->query("SELECT date,friend,content FROM comment WHERE userid = '".$_SESSION["id"]."' ORDER BY id DESC");
while($rows=$query->fetch(PDO::FETCH_ASSOC)){
	$tmp = $tmp.$rows["date"].",".$rows["friend"].",".$rows["content"].","; 	
}
	
echo $tmp;

?>
