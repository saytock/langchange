<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

//セッションを始める
session_start();
	
$query = $pdo->query("SELECT * FROM users WHERE id = '".$_SESSION["id"]."'");
$rows=$query->fetch(PDO::FETCH_ASSOC);

//ユーザー名を取得
$_SESSION["ticket"] = $rows["ticket"];
$tmp = "<center><img class='img-responsive'  src='prof/".$_SESSION["image"]."' width='160px' height='auto'/></center>,<h2 style='text-align:center'>".$rows["name"]." さん</h2>,".$rows["ticket"]."枚"./*<button onClick='toPayPal()'>購入</button>*/",".$_SESSION["friends"]."人,".$rows["nation"].",".$rows["sex"].",".$rows["birthday"].",".$rows["hobby"].",".$_SESSION["id"].",".$rows["serching"].",";


//紹介LCコイン取得確認
if($rows["invticket"]>0){
	$pdo->query("UPDATE users SET invticket = 0 WHERE id ='".$_SESSION["id"]."'");
	$tmp .= "あなたの紹介コードが".$rows["invticket"]."人によって登録されました。\n\nLCコインを".$rows["invticket"]."枚獲得しました。";
}

echo $tmp;

?>
