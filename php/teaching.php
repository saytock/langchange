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
		$tmp = $tmp.$rows["learning"]."登録不可,";
	}

	echo $tmp;
}


///教える日を登録
if(isset($_POST["resistdate"])){
$pdo->query("INSERT INTO teaching (userid,teachingyear,teaching) VALUE('".$_SESSION["id"]."','".$_POST["currentYear"]."','".$_POST["resistdate"]."')");

echo "登録しました";
}

///キャンセル
if(isset($_POST["cancel"])){
	$query = $pdo->query("SELECT friendid FROM teaching WHERE userid = '".$_SESSION["id"]."' && teachingyear = '".$_POST["currentYear"]."' && teaching='".$_POST["date"]."'");
	$rows=$query->fetch(PDO::FETCH_ASSOC);
	if($rows["friendid"]!=""){
		echo "このトークはすでに予約されています";
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
	//echo "トーク開始30分のキャンセルです。\nペナルティが発生しました。\n\n※ペナルティが増えた場合、アカウントを凍結するなどの処置をとらせていただきます。\n\n";

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
	$title = "Your talk is canceled. -Langchange";
	$content = "Your talk is canceled.\nPlease log in and check your talk schedule.\n\nThe LC coin you used is returned, and you got another LC coin.\n\n**Main Page URL: http://langchange.org/english/login.html\n\n**Do not reply to this email. Thank you.";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);

	echo "トークをキャンセルしました";
}

?>
