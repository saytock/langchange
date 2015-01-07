<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");
//セッションを始める
session_start();

if(isset($_POST["init"])){
	$tmp="";
	//自分の教える日予定を取得→登録済表示
	$query = $pdo->query("SELECT teaching FROM teaching WHERE userid = '".$_SESSION["id"]."' && teachingyear ='".$_POST["currentYear"]."' && checks IS NULL");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp .= $rows["teaching"]."<button class='cancel buttons' onClick=\"cancel('".$rows["teaching"]."')\"><img src='images/resistbutton-w.png'/></button>,";
	}

	//自分の教える日予定を取得→マッチング済表示
	$query = $pdo->query("SELECT teaching FROM teaching,users WHERE userid = '".$_SESSION["id"]."' && teachingyear ='".$_POST["currentYear"]."' && (checks IS NOT NULL && checks != 't') && users.id = friendid");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp .= $rows["teaching"]."<div class='cancel buttons' onClick=\"cancelMatch('".$rows["teaching"]."')\"><img src='images/resistbutton-c.png'/></div>,";
	}

	//自分の受ける日予定を取得→受ける日表示
	$query = $pdo->query("SELECT learning FROM learning WHERE userid = '".$_SESSION["id"]."' && learningyear ='".$_POST["currentYear"]."'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp = $tmp.$rows["learning"]."Not Available,";
	}

	echo $tmp;
}


///教える日を登録
if(isset($_POST["resistdate"])){
$pdo->query("INSERT INTO teaching (userid,teachingyear,teaching) VALUE('".$_SESSION["id"]."','".$_POST["currentYear"]."','".$_POST["resistdate"]."')");

echo "You opened the talk.";
}

///キャンセル
if(isset($_POST["cancel"])){
	$query = $pdo->query("SELECT friendid FROM teaching WHERE userid = '".$_SESSION["id"]."' && teachingyear = '".$_POST["currentYear"]."' && teaching='".$_POST["date"]."'");
	$rows=$query->fetch(PDO::FETCH_ASSOC);
	if($rows["friendid"]!=""){
		echo "The talk is already booked.";
	}else{
		$pdo->query("DELETE FROM teaching WHERE userid ='".$_SESSION["id"]."' && teachingyear ='".$_POST["currentYear"]."' && teaching='".$_POST["date"]."'");
		echo "ok";
	}
}

///マッチングをキャンセル
if(isset($_POST["mCancel"])){
	//フレンドIDを取得
	$query = $pdo->query("SELECT friendid,ticket,mail FROM teaching,users WHERE userid = '".$_SESSION["id"]."' && teachingyear ='".$_POST["currentYear"]."' && teaching='".$_POST["date"]."' && users.id = friendid");
	$rows=$query->fetch(PDO::FETCH_ASSOC);

	//自分の予定をキャンセル
	$pdo->query("DELETE FROM teaching WHERE userid ='".$_SESSION["id"]."' && teachingyear ='".$_POST["currentYear"]."'  && teaching='".$_POST["date"]."'");
	$pdo->query("DELETE FROM history WHERE userid ='".$_SESSION["id"]."' && year ='".$_POST["currentYear"]."' && type = 'teaching' && date='".$_POST["date"]."'");

	//ペナルティチェック
	$tYear = $_POST["currentYear"];
	$tMonth= mb_substr($_POST["date"],0,2);
	$tDate = mb_substr($_POST["date"],5,2);
	$tHour = mb_substr($_POST["date"],11,2);
	$tMinute=mb_substr($_POST["date"],14,2);

	if(intval($tHour)>=26) $tHour= intval($tHour) - 26;
	$targetTime =$tYear*100000000+$tMonth*1000000+$tDate*10000+$tHour*100+$tMinute;

//	echo $targetTime."------".$_POST["currentTime"]."\n";
//	echo $targetTime - $_POST["currentTime"];

	//if(($targetTime - $_POST["currentTime"]) < 70) //60進数を10進数に変換して考える
	//echo "The talk is canceled later than 30 minutes before it starts. \nYou got a penalty!\n\n**Have you got too many penalties, we would possibly freeze your account.\n\n";

	//自分のチケットを減らす
	$myticket=$pdo->query("SELECT ticket FROM users WHERE id = '".$_SESSION["id"]."'");
	$myticketArray=$myticket->fetch(PDO::FETCH_ASSOC);
	$pdo->query("UPDATE users SET ticket = ".($myticketArray["ticket"]-1)." WHERE id = '".$_SESSION["id"]."'");

	//相手の予定をキャンセル
	$pdo->query("UPDATE learning SET comment = 'j' WHERE userid = '".$rows["friendid"]."' && learningyear = '".$_POST["currentYear"]."' && learning = '".$_POST["date"]."'");

	//相手のチケットを増やす
	$pdo->query("UPDATE users SET ticket =".($rows["ticket"]+2)." WHERE id ='".$rows["friendid"]."'");

	//相手にキャンセルメール
	$to = $rows["mail"];
	$title = "Langchange:キャンセルお知らせメール";
	$content = "あなたのトークがキャンセルされました。\nLCコインはあなたに返却され、さらに1枚獲得しました。\nログインしてスケジュールを確認してください\n\n★メインページURL: http://langchange.org/login.html\n\n※なお、このメールには返信できません";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);

	echo "The talk is canceled.";
}

?>
