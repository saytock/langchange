<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");
//セッションを始める
session_start();


///初期化
if(isset($_POST["init"])){
$tmp = "";
//受ける予定を取得
$query = $pdo->query("SELECT learning,name FROM learning,users WHERE userid = '".$_SESSION["id"]."' && learningyear = '".$_POST["year"]."' && learning LIKE '".$_POST["month"]."月%' && users.id = friendid");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp = $tmp.$rows["learning"]."  (".$rows["name"]."さん) <英語>,"; 	
	}

//教える予定を取得
$query = $pdo->query("SELECT teaching,name FROM teaching,users WHERE userid = '".$_SESSION["id"]."' && checks IS NOT NULL && teachingyear = '".$_POST["year"]."' && teaching LIKE '".$_POST["month"]."月%' && users.id = friendid");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp = $tmp.$rows["teaching"]."  (".$rows["name"]."さん) <日本語>,"; 	
	}

//教える予定を取得 （マッチングされてないやつ)
$query = $pdo->query("SELECT teaching FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks IS NULL && teachingyear = '".$_POST["year"]."' && teaching LIKE '".$_POST["month"]."月%'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp = $tmp.$rows["teaching"]." (マッチング待ち) <日本語>,"; 	
	}


echo $tmp;
}



///マッチング情報取得
if(isset($_POST["checkMatching"])){
//iPhoneのための初期化
$foriPhone="";
$ua=$_SERVER['HTTP_USER_AGENT'];
if((strpos($ua,’iPhone’)!==false)||(strpos($ua,’iPad’)!==false)) {
	$foriPhone = "\n※appear.inをダウンロードしていない人は、「つかいかた」より必ずダウンロードを済ませてください。\nビデオチャットに必要のアプリとなります。";
}

$tmp = "";
	$query = $pdo->query("SELECT teaching,teachingyear FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks = 'c'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tTime = explode("=",$rows["teaching"]);
		$tmp .= $tTime[0]." ".$tTime[1]."のトークがマッチングされました。\nトークの5分前にメインページで出席登録をしましょう。".$foriPhone.",";
		$pdo->query("UPDATE teaching SET checks = 'f' WHERE userid = '".$_SESSION["id"]."' && checks = 'c'&& teachingyear ='".$rows["teachingyear"]."' && teaching = '".$rows["teaching"]."'");
	}
	echo $tmp;
}

///マッチングされなかったトークの取得
if(isset($_POST["falseMatching"])){
date_default_timezone_set('UTC');

$currentTime = $_POST["year"] * 100000000 + $_POST["month"] * 1000000 + $_POST["date"] * 10000 + $_POST["hour"] * 100 + $_POST["minute"];

$targetTime = "";
$tYear="";
$tMonth="";
$tDate="";
$tHour="";
$tMinute="";

$tmp = "";
	$query = $pdo->query("SELECT teaching,teachingyear FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks IS NULL");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){

		$tYear = $rows["teachingyear"];
		$tMonth= mb_substr($rows["teaching"],0,2);
		$tDate = mb_substr($rows["teaching"],5,2);
		$tHour = mb_substr($rows["teaching"],11,2);
		$tMinute=mb_substr($rows["teaching"],14,2);

		if(intval($tHour)>=26) $tHour= intval($tHour) - 26;
		$targetTime =$tYear*100000000+$tMonth*1000000+$tDate*10000+$tHour*100+$tMinute; 
		
		//echo $_POST["hour"].$_POST["minute"].$_POST["month"].$_POST["date"].$_POST["year"];
		//echo intval($tHour).intval($tMinute).intval($tMonth).intval($tDate).intval($tYear);
		//echo $currentTime."--".$targetTime."\n";		
	
		if($currentTime>$targetTime){
			$tmpTime = explode("=",$rows["teaching"]);
			$tmp .= $tmpTime[0]." ".$tmpTime[1]."のトークは残念ながらマッチングされませんでした。\n\nヒント：数日後までのトークをおおめに登録しておくと、マッチングする確率があがります,";
			$pdo->query("UPDATE teaching SET checks = 'n' WHERE userid = '".$_SESSION["id"]."' && checks IS NULL && teachingyear = '".$rows["teachingyear"]."' && teaching = '".$rows["teaching"]."'");
		}
		
	}
	echo $tmp;
}

///キャンセルされたマッチングを取得
if(isset($_POST["cancelMatching"])){
//teachingのほう
$tmp = "";
	$query = $pdo->query("SELECT teaching,teachingyear FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks = 't' ");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tTime = explode("=",$rows["teaching"]);
		$tmp .= $tTime[0]." ".$tTime[1]."のトークがキャンセルされました。\nまだ募集し続ける場合は、再度登録してください。,";
		$pdo->query("UPDATE teaching SET checks = null WHERE userid = '".$_SESSION["id"]."' && checks = 't' && teachingyear ='".$rows["teachingyear"]."'&& teaching = '".$rows["teaching"]."'");
		
	}
	echo $tmp;

//learningのほう
$tmp = "";
	$query = $pdo->query("SELECT learning,learningyear FROM learning WHERE userid = '".$_SESSION["id"]."' && comment = 'j' ");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tTime = explode("=",$rows["learning"]);
		$tmp .= $tTime[0]." ".$tTime[1]."のトークがキャンセルされました。\nLCコインはあなたに返却され、さらに1枚獲得しました。,";
		$pdo->query("DELETE FROM learning WHERE userid ='".$_SESSION["id"]."' && learningyear ='".$rows["learningyear"]."' && learning='".$rows["learning"]."'");
	}
	echo $tmp;
	
}

///ペナルティをチェック
if(isset($_POST["checkPenalty"])){
date_default_timezone_set('UTC');

$currentTime = $_POST["year"] * 100000000 + $_POST["month"] * 1000000 + $_POST["date"] * 10000 + $_POST["hour"] * 100 + $_POST["minute"];

$targetTime = "";
$tYear="";
$tMonth="";
$tDate="";
$tHour="";
$tMinute="";

//teachingのほう
$tmp = "";
	$query = $pdo->query("SELECT teaching,teachingyear FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks IS NOT NULL && comment IS NULL");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tYear = $rows["teachingyear"];
		$tMonth= mb_substr($rows["teaching"],0,2);
		$tDate = mb_substr($rows["teaching"],5,2);
		$tHour = mb_substr($rows["teaching"],11,2);
		$tMinute=mb_substr($rows["teaching"],14,2);

		//トーク時間開始10分後までok
		$tMinute += 10;

		$targetTime =$tYear*100000000+$tMonth*1000000+$tDate*10000+$tHour*100+$tMinute; 
		//echo $_POST["hour"].$_POST["minute"].$_POST["month"].$_POST["date"].$_POST["year"];
		//echo intval($tHour).intval($tMinute).intval($tMonth).intval($tDate).intval($tYear);
		//echo $currentTime."--".$targetTime."\n";		
	
		if($currentTime>$targetTime){
			$tmpTime = explode("=",$rows["teaching"]);
			$tmp .= $tmpTime[0]." ".$tmpTime[1]."のトークのスタンバイ確認がとれませんでした。\nペナルティとしてLCコインが2枚減りました。\n\n※トークの前に必ずスタンバイボタンを押しましょう。,";
			
			//トーク削除処理
			$pdo->query("DELETE FROM teaching WHERE userid ='".$_SESSION["id"]."' && teachingyear ='".$rows["teachingyear"]."' && teaching='".$rows["teaching"]."'");
			//チケット処理
			$_SESSION["ticket"] -= 2;
			$pdo->query("UPDATE users SET ticket = '".$_SESSION["ticket"]."' WHERE id = '".$_SESSION["id"]."'");
		}
		
	}

//learningのほう
	$query = $pdo->query("SELECT learning,learningyear FROM learning WHERE userid = '".$_SESSION["id"]."' && comment IS NULL");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tYear = $rows["learningyear"];
		$tMonth= mb_substr($rows["learning"],0,2);
		$tDate = mb_substr($rows["learning"],5,2);
		$tHour = mb_substr($rows["learning"],11,2);
		$tMinute=mb_substr($rows["learning"],14,2);
		
		//トーク時間開始10分後までok
		$tMinute += 10;

		$targetTime =$tYear*100000000+$tMonth*1000000+$tDate*10000+$tHour*100+$tMinute;

		//echo $_POST["hour"].$_POST["minute"].$_POST["month"].$_POST["date"].$_POST["year"]."ppp";
		//echo $tHour."-".$tMinute."-".$tMonth."-".$tDate."-".intval($tYear)."@@@";
		//echo $rows["learning"];
		//echo $currentTime."--".$targetTime."\n";		
	
		if($currentTime>$targetTime){
			$tmpTime = explode("=",$rows["learning"]);
			$tmp .= $tmpTime[0]." ".$tmpTime[1]."のトークのスタンバイ確認がとれませんでした。\nペナルティとしてLCコインが1枚減りました。\n\n※トークの前に必ずスタンバイボタンを押しましょう。,";
			
			//トーク削除処理
			$pdo->query("DELETE FROM learning WHERE userid ='".$_SESSION["id"]."' && learningyear ='".$rows["learningyear"]."' && learning='".$rows["learning"]."'");
			//チケット処理
			$_SESSION["ticket"] -= 1;
			$pdo->query("UPDATE users SET ticket = '".$_SESSION["ticket"]."' WHERE id = '".$_SESSION["id"]."'");
		}
		
	}
	echo $tmp;
}

if(isset($_POST["checkStanby"])){
	//自分のチケットを増やす
	if($_POST["talktype"]=="teaching"){
		$_SESSION["ticket"] += 2;
		$pdo->query("UPDATE users SET ticket = '".$_SESSION["ticket"]."' WHERE id = '".$_SESSION["id"]."'");
		echo "相手が時間内にスタンバイしませんでした\n\nあなたはチケットを2枚獲得しました";
	}else{
		$_SESSION["ticket"] += 3;
		$pdo->query("UPDATE users SET ticket = '".$_SESSION["ticket"]."' WHERE id = '".$_SESSION["id"]."'");
		echo "相手が時間内にスタンバイしませんでした\n\nあなたはチケットを3枚獲得しました\n※ペナルティ分2枚＋返却1枚";	
	}


}
		
?>
