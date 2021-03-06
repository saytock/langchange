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
	$foriPhone = "**Video chat will not run properly on current browser. Please use Google Chrome or Firefox. For more detail, click <a href='http://www.langchange.org/english/howtouse.html#browser'>here</a>.";
}

	$tmp = "";
	$query = $pdo->query("SELECT teaching,teachingyear FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks = 'c'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tTime = explode("=",$rows["teaching"]);
		$tmp .= "Talk info: ".$tTime[0]." ".$tTime[1]." \nYour talk above is booked!\nClick Standby button at Main Page 5 minutes before the talk.".$foriPhone.",";
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
			$tmp .= "Talk info: ".$tmpTime[0]." ".$tmpTime[1]." \nYour talk above was not booked.\n\nTips: Open your talks a few days earlier to get more talks booked.,";
			$pdo->query("DELETE FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks IS NULL && teachingyear = '".$rows["teachingyear"]."' && teaching = '".$rows["teaching"]."'");
		}

	}


///キャンセルされたマッチングを取得
//teachingのほう
	$query = $pdo->query("SELECT teaching,teachingyear FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks = 't' ");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tTime = explode("=",$rows["teaching"]);
		$tmp .= "Talk info: ".$tTime[0]." ".$tTime[1]."\n Your talk above was canceled. You got 1 LC coin.\nOpen the talk again to get a new partner.,";
		$pdo->query("DELETE FROM teaching WHERE userid ='".$_SESSION["id"]."' && teachingyear ='".$rows["teachingyear"]."' && teaching='".$rows["teaching"]."'");
		$pdo->query("DELETE FROM history WHERE userid ='".$_SESSION["id"]."' && year ='".$rows["teachingyear"]."' && type = 'teaching' && date='".$rows["teaching"]."'");

	}

//learningのほう
	$query = $pdo->query("SELECT learning,learningyear FROM learning WHERE userid = '".$_SESSION["id"]."' && comment = 'j' ");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tTime = explode("=",$rows["learning"]);
		$tmp .= "Talk info: ".$tTime[0]." ".$tTime[1]."\nYour talk was canceled.\nLC coin you used is returned and you got another coin.,";
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
			$tmp .= "Talk info: ".$tmpTime[0]." ".$tmpTime[1]."\nIt seems you didn't show up for the talk.\nYou lost 2 LC coins as a penalty!\n\n**Please don't forget to click the Standby button before the talk.,";

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
			$tmp .= "Talk info: ".$tmpTime[0]." ".$tmpTime[1]."\n It seems you didn't show up for the talk.\nYou lost 1 LC coin as a penalty!\n\n**Please don't forget to click the Standby button before the talk.,";

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
