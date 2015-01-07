<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

//セッションを始める
session_start();

//友達リストを取得する
if(isset($_POST["getFriend"])){

$tmp = "";
$query = $pdo->query("SELECT image,friendid,name FROM friend,users WHERE friend.userid = '".$_SESSION["id"]."' && users.id = friendid GROUP BY name");
while($rows=$query->fetch(PDO::FETCH_ASSOC)){
	$tmp = $tmp.$rows["image"].",".$rows["friendid"].",".$rows["name"].","; 	
}

echo $tmp;
}

//プロフィール初期化
if(isset($_POST["prof"])){
$tmp="";
//プロフィールを取得する
$query = $pdo->query("SELECT name,image,sex,birthday,college,support FROM users WHERE id = '".$_POST["friendid"]."'");
$rows=$query->fetch(PDO::FETCH_ASSOC);
$tmp = $tmp.$rows["image"].",".$rows["name"].",".$rows["sex"].",".$rows["birthday"].",".$rows["college"].",".$rows["support"].",".$_POST["friendid"]; 	
	
echo $tmp;
}

//プロフィール内のスケジュール初期化
if(isset($_POST["init"])){
	$tmp="";
	//プロフィールの友達の予定を取得
	$query = $pdo->query("SELECT teaching,userid FROM teaching WHERE checks IS NULL && userid = '".$_POST["friendid"]."' && teachingyear ='".$_POST["currentYear"]."'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp .= $rows["teaching"]."<button class='buttons' id='profbutton' value='f-".$rows["teaching"]."_".$rows["userid"]."' onClick='resist(this)' ><img id='profimage' src='images/resistbutton.png' /></button>,"; 	
	}

	//自分の予定→"教える日"表示
	$query = $pdo->query("SELECT teaching FROM teaching WHERE userid = '".$_SESSION["id"]."' && teachingyear ='".$_POST["currentYear"]."'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp .= $rows["teaching"]."登録不可,"; 	
	}

	//自分の予定→予約済表示
	$query = $pdo->query("SELECT learning FROM learning WHERE userid = '".$_SESSION["id"]."' && learningyear ='".$_POST["currentYear"]."'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp .= $rows["learning"]."<div class='cancel buttons' onClick=\"cancelMatch('".$rows["learning"]."')\"><img src='images/resistbutton-c.png'/></div>,"; 	
	}

	echo $tmp;
}

///トークの登録
if(isset($_POST["resistdate"])){
if(0<$_SESSION["ticket"]){
//トークを登録
$pdo->query("INSERT INTO learning (userid,learningyear,learning,friendid) VALUES('".$_SESSION["id"]."','".$_POST["currentYear"]."','".$_POST["resistdate"]."','".$_POST["friendid"]."')");
$pdo->query("UPDATE teaching SET checks = 'c',friendid = '".$_SESSION["id"]."' WHERE checks IS NULL && userid = '".$_POST["friendid"]."' && teaching = '".$_POST["resistdate"]."' && teachingyear ='".$_POST["currentYear"]."'");

//履歴に登録
$pdo->query("INSERT INTO history (userid,friendid,year,date,type) VALUES('".$_SESSION["id"]."','".$_POST["friendid"]."','".$_POST["currentYear"]."','".$_POST["resistdate"]."','learning')");
$pdo->query("INSERT INTO history (userid,friendid,year,date,type) VALUES('".$_POST["friendid"]."','".$_SESSION["id"]."','".$_POST["currentYear"]."','".$_POST["resistdate"]."','teaching')");

//チケットを減らす
$_SESSION["ticket"] -= 1;
$pdo->query("UPDATE users SET ticket = ".$_SESSION["ticket"]." WHERE id = '".$_SESSION["id"]."'");


///友達リストに登録
$query = $pdo->query("SELECT * FROM friend WHERE userid = '".$_SESSION["id"]."' && friendid ='".$_POST["friendid"]."'");
$rows=$query->fetch(PDO::FETCH_ASSOC);
if(empty($rows["id"])){

//友達登録判定
$learning = "";
$teaching = "";
$query = $pdo->query("SELECT type FROM history WHERE userid = '".$_SESSION["id"]."' && friendid ='".$_POST["friendid"]."'");
while($rows=$query->fetch(PDO::FETCH_ASSOC)){
	if($rows["type"]=="learning"){
		$learning = "ok";
	}
	if($rows["type"]=="teaching"){
		$teaching = "ok";
	}
}
	
//友達登録
if($learning=="ok" && $teaching=="ok"){
	$pdo->query("INSERT INTO friend (userid,friendid) VALUES('".$_SESSION["id"]."','".$_POST["friendid"]."')");
	$pdo->query("INSERT INTO friend (userid,friendid) VALUES('".$_POST["friendid"]."','".$_SESSION["id"]."')");
}

}

//メールでおしらせ

echo "登録しました";	

}else{
	echo "LCコインが足りません！まずは教えてLCコインを増やしましょう！";
}


}

//ブロックする
if(isset($_POST["block"])){

 $query = $pdo->query("SELECT * FROM friend WHERE userid = '".$_SESSION["id"]."' && friendid='".$_POST["friendid"]."'");
 $rows=$query->fetch(PDO::FETCH_ASSOC);
 if($rows["id"]!=""){
	//ブロック処理 友達リストから削除
	$pdo->query("DELETE FROM friend WHERE userid = '".$_SESSION["id"]."' AND friendid = '".$_POST["friendid"]."' OR userid = '".$_POST["friendid"]."' AND friendid = '".$_SESSION["id"]."'");

	//ブロック処理 履歴から削除
	$pdo->query("DELETE FROM history WHERE userid = '".$_SESSION["id"]."' AND friendid = '".$_POST["friendid"]."' OR userid = '".$_POST["friendid"]."' AND friendid = '".$_SESSION["id"]."'");

	//ブロックリストに登録
	$pdo->query("INSERT INTO block (userid,friendid) VALUES ('".$_SESSION["id"]."','".$_POST["friendid"]."')");

	echo "ブロックしました";
 }else{
	echo "ブロックは友達ユーザーのみ行えます";
 }
}

?>
