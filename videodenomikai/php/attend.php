<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");
//セッションを始める
session_start();

///出席確認
if(isset($_POST["check"])){
	$date = $_POST["month"]."月".$_POST["date"]."日=".$_POST["time"];
	$tmp="";
	$room;
	$_SESSION["room"];

	//”受ける”か”教えるか”の情報取得
	$query = $pdo->query("SELECT type,userid,friendid FROM history WHERE userid = '".$_SESSION["id"]."' && year = '".$_POST["year"]."' && date ='".$date."'");
	$type=$query->fetch(PDO::FETCH_ASSOC);



	//自分の出席確認
	if($type["type"]=="learning"){
		$query = $pdo->query("SELECT comment FROM learning,users WHERE users.id = friendid && userid = '".$_SESSION["id"]."' && learningyear = '".$_POST["year"]."' && learning ='".$date."'");
		$rows=$query->fetch(PDO::FETCH_ASSOC);	
		$tmp .= $rows["comment"];
		$room=$type["userid"];
		$_SESSION["room"] = $room;
	}else if($type["type"]=="teaching"){
		$query = $pdo->query("SELECT comment FROM teaching,users WHERE users.id = friendid && userid = '".$_SESSION["id"]."' && teachingyear = '".$_POST["year"]."' && teaching ='".$date."'");
		$rows=$query->fetch(PDO::FETCH_ASSOC);
		$tmp .= $rows["comment"];
		$room=$type["friendid"];
		$_SESSION["room"] = $room;
	} 

	$tmp .= ",";

	//相手の出席確認
	if($type["type"]=="teaching"){	
		$query = $pdo->query("SELECT comment FROM learning WHERE friendid = '".$_SESSION["id"]."' && learningyear = '".$_POST["year"]."' && learning ='".$date."'");
		$rows=$query->fetch(PDO::FETCH_ASSOC);	
		$tmp .= $rows["comment"];
	}else if($type["type"]=="learning"){
		$query = $pdo->query("SELECT comment FROM teaching WHERE friendid = '".$_SESSION["id"]."' && teachingyear = '".$_POST["year"]."' && teaching ='".$date."'");
		$rows=$query->fetch(PDO::FETCH_ASSOC);
		$tmp .= $rows["comment"]; 
	}

	//ログを反映
	$tmpArray = explode(",",$tmp);
	if($tmpArray[0]!=""&&$tmpArray[1]!="")		
	$pdo->query("UPDATE history SET checks = 'c' WHERE userid = '".$_SESSION["id"]."' && date = '".$date."'");	

	echo $tmp.",".$room;
	

}

///出席登録
if(isset($_POST["attend"])){
	$date = $_POST["month"]."月".$_POST["date"]."日=".$_POST["time"];

	//”受ける”か”教えるか”の情報取得
	$query = $pdo->query("SELECT type FROM history WHERE userid = '".$_SESSION["id"]."' && year = '".$_POST["year"]."' && date ='".$date."'");
	$rows=$query->fetch(PDO::FETCH_ASSOC);
	
	//出席登録
	if($rows["type"]=="learning"){
		$pdo->query("UPDATE learning SET comment = 'c' WHERE userid = '".$_SESSION["id"]."' && learningyear ='".$_POST["year"]."' && learning ='".$date."'");
		//チケットを減らす
		//$_SESSION["ticket"] -= 1;
		//$pdo->query("UPDATE users SET ticket = '".$_SESSION["ticket"]."' WHERE userid = '".$_SESSION["id"]."'");	
		
		echo "";	
	}else if($rows["type"]=="teaching"){
		$pdo->query("UPDATE teaching SET comment = 'c' WHERE userid = '".$_SESSION["id"]."' && teachingyear ='".$_POST["year"]."' && teaching ='".$date."'");
		//チケットを増やす
		$_SESSION["ticket"] += 1;
		$pdo->query("UPDATE users SET ticket = '".$_SESSION["ticket"]."' WHERE id = '".$_SESSION["id"]."'");
		
		echo "plus";
	}



}
		
?>
