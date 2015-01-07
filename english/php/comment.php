<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

//セッションを始める
session_start();

//初期化
if(isset($_POST["init"])){
$tmp="";

///コメントする相手を取得
//教えた人へのコメント
$query = $pdo->query("SELECT teaching,friend FROM teaching WHERE comment IS NULL && userid = '".$_SESSION["id"]."' && checks ='c'");
while($rows=$query->fetch(PDO::FETCH_ASSOC)){
	$tmp = $tmp.$rows["teaching"].",".$rows["friend"].",";
}

$tmp .= "=,";

//教えてくれた人へのコメント
$query = $pdo->query("SELECT learning,friend FROM learning WHERE comment IS NULL && userid = '".$_SESSION["id"]."'");
while($rows=$query->fetch(PDO::FETCH_ASSOC)){
	$tmp = $tmp.$rows["learning"].",".$rows["friend"].",";
}


echo $tmp;
}


//コメントの送信
if(isset($_POST["send"])){

//コメントのタイプを取得
if($_POST["sw"]==0){
	$type = "teaching";
}
if($_POST["sw"]==1){
	$type = "learning";
}

//langchange実施状況取得
$checks = $_POST["self"]."=".$_POST["yourself"];


//宛先取得
$user = $pdo->query("SELECT id FROM users WHERE name = '".$_POST["friend"]."'");
$userid=$user->fetch(PDO::FETCH_ASSOC);

//コメントを送る
$pdo->query("INSERT INTO comment (userid,date,friend,type,checks,content) VALUES('".$userid["id"]."','".$_POST["date"]."=".$_POST["time"]."','".$_SESSION["name"]."','".$type."','".$checks."','".$_POST["content"]."')");

//コメント送信処理
if($type=="teaching"){ //教えた側の処理
$pdo->query("UPDATE teaching SET comment = 'c' WHERE teaching = '".$_POST["date"]."=".$_POST["time"]."' && userid = '".$_SESSION["id"]."' && checks = 'c'");
}
if($type=="learning"){ //学んだ側の処理
$pdo->query("UPDATE learning SET comment = 'c' WHERE learning = '".$_POST["date"]."=".$_POST["time"]."' && userid = '".$_SESSION["id"]."'");
}

//ペナルティチェック
$pCheck=$pdo->query("SELECT checks FROM comment WHERE date='".$_POST["date"]."=".$_POST["time"]."' && userid ='".$_SESSION["id"]."'");
$pCheckRows=$pCheck->fetch(PDO::FETCH_ASSOC);
if($pCheckRows["checks"]!= ""){
	//比較処理
	$checkArray = explode('=',$pCheckRows["checks"]);
	$checkArray[0];
}

//チケットを受け取る
$_SESSION["ticket"]++;
$pdo->query("UPDATE users SET ticket =".$_SESSION["ticket"]." WHERE id = '".$_SESSION["id"]."'");

echo "The message has been sent.";

}


?>
