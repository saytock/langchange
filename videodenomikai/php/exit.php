<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");
//セッションを始める
session_start();

///ログインチェック
if(isset($_POST["logincheck"])){
	if(isset($_SESSION["id"])){ 
		echo "gotoExit";
	}else{
		$_SESSION["exit"]= "exit";
		echo "gotoLogin";
	}
}

///退会処理
if(isset($_POST["break"])){
	//予約済みトーク処理（teachingのほう）
	date_default_timezone_set('UTC');

	$currentTime = mktime($_POST["hour"],$_POST["minute"],0,$_POST["month"],$_POST["date"],$_POST["year"]);

	$targetTime = "";
	$tYear="";
	$tMonth="";
	$tDate="";
	$tHour="";
	$tMinute="";

	$tmp = "";
	$query = $pdo->query("SELECT teaching,teachingyear,friendid,mail FROM teaching,users WHERE users.id = friendid && userid = '".$_SESSION["id"]."' && checks IS NOT NULL");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){

		$tYear = $rows["teachingyear"];
		$tMonth= mb_substr($rows["teaching"],0,2);
		$tDate = mb_substr($rows["teaching"],5,2);
		$tHour = mb_substr($rows["teaching"],11,2);
		$tMinute=mb_substr($rows["teaching"],14,2);

		if(intval($tHour)>=24) $tHour= intval($tHour) - 24;
		$targetTime = mktime(intval($tHour),intval($tMinute),0,intval($tMonth),intval($tDate),intval($tYear));

		//echo $_POST["hour"].$_POST["minute"].$_POST["month"].$_POST["date"].$_POST["year"];		
		//echo $rows["teaching"]."\n";		
		//echo $tHour.$tMinute.$tMonth.$tDate.$tYear."\n";
		//echo intval($tHour).intval($tMinute).intval($tMonth).intval($tDate).intval($tYear);
		//echo $currentTime."--".$targetTime."\n";
	
		if($currentTime<$targetTime){
		//echo "UPDATE learning SET comment = 'k' WHERE userid = '".$rows["friendid"]."' && learningyear = '".$rows["teachingyear"]."' && learning = '".$rows["teaching"]."'\n";
		//$error = $pdo->errorInfo();
		//echo $error[2];
			//退会通知（ポップアップ）
			$pdo->query("UPDATE learning SET comment = 'k' WHERE userid = '".$rows["friendid"]."' && learningyear = '".$rows["teachingyear"]."' && learning = '".$rows["teaching"]."'");
			//退会通知（メール）
			$tTime = explode("=",$rows["teaching"]);
			$to = $rows["mail"];
			$title = "Langchange:キャンセルお知らせメール";
			$content = "トーク予定だった".$_SESSION["name"]."さんが退会されたため、あなたのトークがキャンセルされました。\nまだトークを募集する場合は、再度登録し直してください\n\n日付：".$tTime[0]."\n時間：".$tTime[1]."\n\n★メインページURL: http://langchange.org/mainpage.html\n\n※なお、このメールには返信できません";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);		
		}
		
	}
	
	//予約済みトーク処理（leaningのほう）
	$query = $pdo->query("SELECT learning,learningyear,friendid,mail FROM learning,users WHERE users.id = friendid && userid = '".$_SESSION["id"]."'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tYear = $rows["learningyear"];
		$tMonth= mb_substr($rows["learning"],0,2);
		$tDate = mb_substr($rows["learning"],3,2);
		$tHour = mb_substr($rows["learning"],7,2);
		$tMinute=mb_substr($rows["learning"],10,2);

		if(intval($tHour)>=24) $tHour= intval($tHour) - 24;
		$targetTime = mktime(intval($tHour),intval($tMinute),0,intval($tMonth),intval($tDate),intval($tYear));

		//echo $_POST["hour"].$_POST["minute"].$_POST["month"].$_POST["date"].$_POST["year"];		
		//echo $rows["learning"]."\n";		
		//echo $tHour.$tMinute.$tMonth.$tDate.$tYear."\n";
		//echo intval($tHour).intval($tMinute).intval($tMonth).intval($tDate).intval($tYear);
		//echo $currentTime."--".$targetTime."\n";		
	
		if($currentTime<$targetTime){
			//退会通知（ポップアップ）
			$pdo->query("UPDATE teaching SET comment = 'k' WHERE userid = '".$rows["friendid"]."' && teachingyear = '".$rows["learningyear"]."' && teaching = '".$rows["learning"]."'");
			//退会通知（メール）
			$tTime = explode("=",$rows["learning"]);
			$to = $rows["mail"];
			$title = "Langchange:キャンセルお知らせメール";
			$content = "トーク予定だった".$_SESSION["name"]."さんが退会されたため、あなたのトークがキャンセルされました。\nあなたのLCコインは返却されました\n\n日付：".$tTime[0]."\n時間：".$tTime[1]."\n\n★メインページURL: http://langchange.org/mainpage.html\n\n※なお、このメールには返信できません";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);		
		}
		
		
	}
	
	//データ削除
	$pdo->query("DELETE FROM friend WHERE userid = '".$_SESSION["id"]."' OR friendid= '".$_SESSION["id"]."'");
	$pdo->query("DELETE FROM block WHERE userid = '".$_SESSION["id"]."' OR friendid='".$_SESSION["id"]."'");
	$pdo->query("DELETE FROM learning WHERE userid = '".$_SESSION["id"]."'");
	$pdo->query("DELETE FROM teaching WHERE userid = '".$_SESSION["id"]."'");
	$pdo->query("DELETE FROM users WHERE id = '".$_SESSION["id"]."'");
	session_destroy();
		
	echo "退会処理が完了しました";
}
?>
