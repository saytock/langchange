<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

//セッションを始める
session_start();

///検索を開始する
if(isset($_POST["start"])){

	$query = $pdo->query("SELECT serching FROM users WHERE id = '".$_SESSION["id"]."'");
	$rows = $query->fetch(PDO::FETCH_ASSOC);
	if($rows["serching"]>0){
		$rows["serching"] -= 1;
		$pdo->query("UPDATE users SET serching = ".$rows["serching"]." , serchable = 'c' WHERE id = '".$_SESSION["id"]."'");
		echo "ok,Started refine search\n\n**The result ramains until you book a talk.";
	}else{
		echo "no,Out of refine search points.\n\n**You can get 2 points by using 1 LC coin.";
	}
}
?>
