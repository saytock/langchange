<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");
//セッションを始める
session_start();

//カレンダーの初期化
if(isset($_POST["init"])){
	$tmp="";
	$friends=array();
	$val="";


	//友達を取得
	$query = $pdo->query("SELECT users.id FROM friend,users WHERE userid = '".$_SESSION["id"]."' && users.id = friend.friendid");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		array_push($friends,$rows["id"]);
	}

	//検索システム
	$serchFlag = "checks IS NULL && ";

	if($_POST['currentLevel']!='all') $serchFlag .= "support = '".$_POST["currentLevel"]."' && ";
	if($_POST['currentSex']!='all') $serchFlag .= "sex = '".$_POST["currentSex"]."' && ";
	if($_POST['currentNation']!='all') $serchFlag .= "nation = '".$_POST["currentNation"]."' && ";
	if($_POST['currentName']!='') $serchFlag .= "name LIKE '%".$_POST["currentName"]."%' && ";

	//出身地取得
	$query = $pdo->query("SELECT nation FROM users WHERE country='外国人' GROUP BY nation");
	$nation="<option value='all'>選択しない</option>";
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$nation .= "<option value='".$rows["nation"]."'>".$rows["nation"]."</option>";
	}


$hobbyCount=0;
	foreach($_POST["currentHobby"] as $value){
		if($value != ""){
			if($hobbyCount==0)
			$serchFlag .= "(";

			$serchFlag .= "hobby = '".$value."' || ";
			$hobbyCount++;
		}
	}
	if($hobbyCount!=0){
		$queryLength = strlen($serchFlag);
		$serchFlag = substr($serchFlag,0,$queryLength-3).") && ";
	}

	$queryLength = strlen($serchFlag);

	//checkが付いていない自分以外の"教える"人を取得→登録ボタン設置
	$sql = "SELECT userid,name,teaching,birthday FROM teaching,users WHERE users.id = userid && userid != '".$_SESSION["id"]."' && teachingyear ='".$_POST["currentYear"]."' && country != (SELECT country FROM users WHERE id ='".$_SESSION["id"]."') && userid not in (SELECT friendid FROM block WHERE userid = '".$_SESSION["id"]."') &&".substr($serchFlag,0,$queryLength-3);

// echo $sql;

	$query = $pdo->query($sql);
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
//echo $tmp;
		if($_POST['currentBirthday']!='all'){
			//生年月日チェック
			$birthdayTmp = explode("/",$rows["birthday"]);
			$birthdayTmp2 = $_POST["currentYear"] - intval($birthdayTmp[0]);
//echo "--------".$_POST["currentBirthday"]."---------".$birthdayTmp2."---";
			if($_POST["currentBirthday"] <= $birthdayTmp2 && $birthdayTmp2 < ($_POST["currentBirthday"]+10)  ){
				$tmp .= $rows["teaching"]."<a id='b-".$rows["teaching"]."' class='balloon' title=''><button class='buttons' id='resistbutton' value='".$rows["teaching"]."' onClick='Resist(this)' ><img src='images/resistbutton.png'/></button></a>,";
				foreach($friends as $value){
					if($rows["userid"]==$value){
						$val.=$rows["teaching"]."<div id='".$value."' class='日本語トーク' onClick='getProfile(this)'><div class='link'>".$rows["name"]."</div> さんの予定があります</div>,";
					}
				}
			}
		}else{
			$tmp .= $rows["teaching"]."<a id='b-".$rows["teaching"]."' class='balloon' title=''><button class='buttons' id='resistbutton' value='".$rows["teaching"]."' onClick='Resist(this)' ><img src='images/resistbutton.png'/></button></a>,";
				foreach($friends as $value){
					if($rows["userid"]==$value){
						$val.=$rows["teaching"]."<div id='".$value."' class='日本語トーク' onClick='getProfile(this)'><div class='link'>".$rows["name"]."</div> さんの予定があります</div>,";
					}
				}
		}

	}

	//自分の予定→"教える日"表示
	$query = $pdo->query("SELECT teaching FROM teaching WHERE userid = '".$_SESSION["id"]."' && teachingyear ='".$_POST["currentYear"]."'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp .= $rows["teaching"]."登録不可,";
	}

	//自分の予定→登録済表示
	$query = $pdo->query("SELECT learning,name FROM learning,users WHERE userid = '".$_SESSION["id"]."' && learningyear ='".$_POST["currentYear"]."' && users.id = friendid && (comment != 'j' || comment IS NULL)");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp .= $rows["learning"]."<div class='cancel' onClick=\"cancelMatch('".$rows["learning"]."')\"><img src='images/resistbutton-c.png'/></div>,";
	}

	//検索可能回数取得・検索状況取得
	$query = $pdo->query("SELECT serching,serchable FROM users WHERE id = '".$_SESSION["id"]."'");
	$rows=$query->fetch(PDO::FETCH_ASSOC);

	echo $tmp."=,".$val.$rows["serching"].",".$rows["serchable"].",".$nation;
}

/////登録処理
if(isset($_POST["resistdate"])){
if(0<$_SESSION["ticket"]){

//自分がもう予約してないかチェック（エラー防止）
$query = $pdo->query("SELECT friendid FROM learning WHERE userid = '".$_SESSION["id"]."' && learningyear = '".$_POST["currentYear"]."' && learning='".$_POST["resistdate"]."'");
	$rows=$query->fetch(PDO::FETCH_ASSOC);
	if($rows["friendid"]!=""){
		echo "このトークはすでに予約されています";
	}else{

//マッチング
//checkがついてなくて自分以外で選択した日にちを登録しているひとを取得 ※その中の一番上の人とマッチングしてるとりあえず
$query = $pdo->query("SELECT userid,mail FROM teaching,users WHERE users.id = teaching.userid && checks IS NULL && userid !='".$_SESSION["id"]."' && teaching = '".$_POST["resistdate"]."' && teachingyear ='".$_POST["currentYear"]."' && userid NOT IN (SELECT friendid FROM block WHERE userid ='".$_SESSION["id"]."') && country != (SELECT country FROM users WHERE id ='".$_SESSION["id"]."') ORDER BY teaching.id ASC");
$rows = $query->fetch(PDO::FETCH_ASSOC);

//登録
$pdo->query("INSERT INTO learning (userid,learningyear,learning,friendid) VALUE('".$_SESSION["id"]."','".$_POST["currentYear"]."','".$_POST["resistdate"]."','".$rows["userid"]."')");
$pdo->query("UPDATE teaching SET checks = 'c',friendid = '".$_SESSION["id"]."' WHERE checks IS NULL && userid = '".$rows["userid"]."' && teaching = '".$_POST["resistdate"]."' && teachingyear ='".$_POST["currentYear"]."'");

//履歴に登録
$pdo->query("INSERT INTO history (userid,friendid,year,date,type) VALUE('".$_SESSION["id"]."','".$rows["userid"]."','".$_POST["currentYear"]."','".$_POST["resistdate"]."','learning')");
$pdo->query("INSERT INTO history (userid,friendid,year,date,type) VALUE('".$rows["userid"]."','".$_SESSION["id"]."','".$_POST["currentYear"]."','".$_POST["resistdate"]."','teaching')");

//チケットを減らす
$myticket=$pdo->query("SELECT ticket FROM users WHERE id = '".$_SESSION["id"]."'");
$myticketArray=$myticket->fetch(PDO::FETCH_ASSOC);
$pdo->query("UPDATE users SET ticket = ".($myticketArray["ticket"]-1)." WHERE id = '".$_SESSION["id"]."'");

//検索状況更新
if($_POST["serchingnow"]!="no"){
	$pdo->query("UPDATE users SET serchable = null WHERE id = '".$_SESSION["id"]."'");
}


	//メールでおしらせ
	$to = $rows["mail"];
	$title = "Your talk has been booked! -Langchange";
	$content = "Congrats! Your talk has been booked.\nPlease log in and check your talk schedule.\n\nBe sure to show up at Main Page 5 minutes before and click the standby button no later than 10 minutes after the starting time. If you missed, you will get a penalty.\n\nFor your convenience, talk guidelines are available. Go to the page from the top blue bar and read them carefully for you to be well prepared. \n\n**Main Page URL: http://langchange.org/english/login.html\n\n**Do not reply to this email. Thank you.";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);


//自分にメールでお知らせ
$query = $pdo->query("SELECT mail FROM users WHERE id = '".$_SESSION["id"]."'");
$rows=$query->fetch(PDO::FETCH_ASSOC);
	$to = $rows["mail"];
	$title = "Langchange:マッチングお知らせメール";
	$content = "あなたの英語トークが予約されました。\n\n★時間5分前になったら\n5分前には、必ずメインページに行きスタンバイしてください。お互いの出席が確認されると、自動でビデオが出現します。開始時間10分後までにスタンバイボタンをクリックしないと、欠席とみなされペナルティが発生するので注意してください。パートナーの欠席時は10分後までスタンバイして頂いた時に、お詫びとしてコインを数枚差し上げます。\n\nメインページURL: http://langchange.org/login.html\n\n★ビデオが立ち上がらない時に\nビデオが立ち上がらない時は、ブラウザのポップアップブロック機能が働いています。その場合は、ブラウザ上部にあるポップアップの「許可」のボタンを押し、再度メインページの更新をして下さい。\n＊詳しくは、サイトの青いトップバーの「よくある質問」に記載されています。\n\n★トークが不安の方へ\n英語が苦手な方は、自己紹介テンプレートに従って、パートナーに自己紹介を聞いてもらいましょう。慣れるまで、あらかじめ話す文章を用意しておくとスムーズに始められます。パートナーも日本語を勉強している人がほとんどです。ゆっくり話すのをお願いしてみたり、日本語でのサポートを頼んでみましょう。\nまた、サイトの青いトップバーに「トークのガイド」がございます。トークをスムーズに始め、気持ちよくすすめるためにも、トークの前に一読されるようお願いします。\n\n★iOS（iPhone,iPad）をお使いの方へ\niOSをお使いの方はビデオ通話に「Appear.in」というアプリの事前ダウンロードが必要です。サイトの青いトップバーの「つかいかた」にダウンロード先が乗っております。\nアプリのダウンロードが事前にされている状態で、お互いの出席が確認されると、メインページから自動でビデオが立ち上がります。ビデオの立ち上がり時にアプリを操作されてしまいますと、相手とうまくつながらない時がございます。その場合は、メインページに戻り、ページの更新を行うと、ビデオが自動で立ち上がり、相手と繋がります。\n\n※なお、このメールには返信できません";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);




echo "マッチングが完了しました,ok,".$_POST["resistdate"];
	}

}else{
	echo "LCコインが足りません！まずは教えてLCコインを増やしましょう！,no,".$_POST["resistdate"];
}


}


///マッチングをキャンセル
if(isset($_POST["mCancel"])){
	//フレンドIDを取得
	$query = $pdo->query("SELECT friendid,ticket,mail FROM learning,users WHERE userid = '".$_SESSION["id"]."' && learningyear ='".$_POST["currentYear"]."' && learning='".$_POST["date"]."' && users.id = friendid");
	$rows=$query->fetch(PDO::FETCH_ASSOC);

	//自分の予定をキャンセル
	$pdo->query("DELETE FROM learning WHERE userid ='".$_SESSION["id"]."' && learningyear ='".$_POST["currentYear"]."' && learning='".$_POST["date"]."'");
	$pdo->query("DELETE FROM history WHERE userid ='".$_SESSION["id"]."' && year ='".$_POST["currentYear"]."' && type = 'learning' && date='".$_POST["date"]."'");



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
	//$_SESSION["ticket"] -= 1;
	//$pdo->query("UPDATE users SET ticket ='".$_SESSION["ticket"]."'WHERE id ='".$_SESSION["id"]."'");

	//相手の予定をキャンセル
	$pdo->query("UPDATE teaching SET checks = 't' WHERE userid ='".$rows["friendid"]."' && teachingyear ='".$_POST["currentYear"]."' && teaching='".$_POST["date"]."'");

	//相手のチケットを増やす
	$pdo->query("UPDATE users SET ticket =".($rows["ticket"]+1)." WHERE id ='".$rows["friendid"]."'");

	//相手にキャンセルメール
	$to = $rows["mail"];
	$title = "Your talk is canceled. -Langchange";
	$content = "Your talk is canceled.\nPlease log in and check your talk schedule.\n\nOpen the talk again to get a new partner.\n\n**Main Page URL: http://langchange.org/english/login.html\n\n**Do not reply to this email. Thank you.";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);

	echo "トークをキャンセルしました";
}


?>
