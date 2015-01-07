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
		echo "ok,検索を開始しました\n\n※絞り込み予約が完了するまで\n効果が続きます。";
	}else{
		echo "no,検索可能回数が0回のため検索を開始できません。\n\n※LCコインを1枚つかって検索可能回数を2回増やすことができます。";
	}
}
?>
