<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");
//セッションを始める
session_start();

///検索可能回数を増やす
if($_SESSION["ticket"]>0){
//チケットを減らす
$_SESSION["ticket"] -= 1;

//検索可能回数取得
$query = $pdo->query("SELECT serching FROM users WHERE id = '".$_SESSION["id"]."'");
$rows=$query->fetch(PDO::FETCH_ASSOC);
$rows["serching"] += 2;
$pdo->query("UPDATE users SET serching = ".$rows["serching"].",ticket = ".$_SESSION["ticket"]." WHERE id = '".$_SESSION["id"]."'");

	echo "You've got 2 refine search points.";
}else{
	echo "Short of LC coins! \n\n※Get LC coins by helping English learners.";
}



?>
