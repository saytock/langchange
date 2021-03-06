<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");
//セッションを始める
session_start();

///ポップアップを確認する
if(isset($_POST["checkpop"])){

//マッチングされたかどうかの確認
date_default_timezone_set('UTC');
//iPhoneのための初期化
$foriPhone="";
$ua=$_SERVER['HTTP_USER_AGENT'];
if((strpos($ua,’iPhone’)!==false)||(strpos($ua,’iPad’)!==false)) {
	$foriPhone = "※現在おつかいのブラウザでは、ビデオチャットが正しく起動しないおそれがあります。Google ChromeかFirefoxをおつかいください。くわしくは<a href='http://www.langchange.org/howtouse.html#browser'>こちら</a>。";
}

	$tmp = "";
	$query = $pdo->query("SELECT teaching,teachingyear FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks = 'c'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tTime = explode("=",$rows["teaching"]);
		$tmp .= $tTime[0]." ".$tTime[1]."のトークが予約されました。\nトークの5分前にメインページで出席登録をしましょう。".$foriPhone.",";
		$pdo->query("UPDATE teaching SET checks = 'f' WHERE userid = '".$_SESSION["id"]."' && checks = 'c'&& teachingyear ='".$rows["teachingyear"]."' && teaching = '".$rows["teaching"]."'");
	}


///マッチングされなかったトークの取得

$currentTime = $_POST["year"] * 100000000 + $_POST["month"] * 1000000 + $_POST["date"] * 10000 + $_POST["hour"] * 100 + $_POST["minute"];

$targetTime = "";
$tYear="";
$tMonth="";
$tDate="";
$tHour="";
$tMinute="";

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
			$pdo->query("DELETE FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks IS NULL && teachingyear = '".$rows["teachingyear"]."' && teaching = '".$rows["teaching"]."'");
		}

	}


///キャンセルされたマッチングを取得

//teachingのほう
	$query = $pdo->query("SELECT teaching,teachingyear FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks = 't' ");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tTime = explode("=",$rows["teaching"]);
		$tmp .= $tTime[0]." ".$tTime[1]."のトークがキャンセルされました。\nLCコインを1枚獲得しました。\nまだ募集し続ける場合は、お手数ですが再度トークを登録してください。,";
		$pdo->query("DELETE FROM teaching WHERE userid ='".$_SESSION["id"]."' && teachingyear ='".$rows["teachingyear"]."' && teaching='".$rows["teaching"]."'");
		$pdo->query("DELETE FROM history WHERE userid ='".$_SESSION["id"]."' && year ='".$rows["teachingyear"]."' && type = 'teaching' && date='".$rows["teaching"]."'");

	}

//learningのほう
	$query = $pdo->query("SELECT learning,learningyear FROM learning WHERE userid = '".$_SESSION["id"]."' && comment = 'j' ");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tTime = explode("=",$rows["learning"]);
		$tmp .= $tTime[0]." ".$tTime[1]."のトークがキャンセルされました。\nLCコインはあなたに返却され、さらに1枚獲得しました。,";
		$pdo->query("DELETE FROM learning WHERE userid ='".$_SESSION["id"]."' && learningyear ='".$rows["learningyear"]."' && learning='".$rows["learning"]."'");
		$pdo->query("DELETE FROM history WHERE userid ='".$_SESSION["id"]."' && year ='".$rows["learningyear"]."' && type = 'learning' && date='".$rows["learning"]."'");

	}


///ペナルティをチェック
date_default_timezone_set('UTC');

$currentTime = $_POST["year"] * 100000000 + $_POST["month"] * 1000000 + $_POST["date"] * 10000 + $_POST["hour"] * 100 + $_POST["minute"];

$targetTime = "";
$tYear="";
$tMonth="";
$tDate="";
$tHour="";
$tMinute="";

//teachingのほう
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

			//チケットを減らす
			$myticket=$pdo->query("SELECT ticket FROM users WHERE id = '".$_SESSION["id"]."'");
			$myticketArray=$myticket->fetch(PDO::FETCH_ASSOC);
			$pdo->query("UPDATE users SET ticket = ".($myticketArray["ticket"]-2)." WHERE id = '".$_SESSION["id"]."'");

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
			//チケットを減らす
			$myticket=$pdo->query("SELECT ticket FROM users WHERE id = '".$_SESSION["id"]."'");
			$myticketArray=$myticket->fetch(PDO::FETCH_ASSOC);
			$pdo->query("UPDATE users SET ticket = ".($myticketArray["ticket"]-1)." WHERE id = '".$_SESSION["id"]."'");

		}

	}

	echo $tmp;
}

?>
