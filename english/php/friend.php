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
$query = $pdo->query("SELECT name,image,sex,birthday,college,nation,support FROM users WHERE id = '".$_POST["friendid"]."'");
$rows=$query->fetch(PDO::FETCH_ASSOC);
$tmp = $tmp.$rows["image"].",".$rows["name"].",".$rows["sex"].",".$rows["birthday"].",".$rows["college"].",".$rows["nation"].",".$rows["support"].",".$_POST["friendid"];

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
	//相手のメールアドレスを取得
	$query = $pdo->query("SELECT mail FROM users WHERE id = '".$_POST["friendid"]."'");
	$rows=$query->fetch(PDO::FETCH_ASSOC);

	$tTime = explode("=",$_POST["resistdate"]);
	$to = $rows["mail"];
	$title = "Langchange:マッチングお知らせメール";
	$content = "おめでとうございます。あなたの登録していた日本語トークが予約されました！\nログインしてスケジュールを確認しましょう\n\n\n\n★トーク開始5分前になったら\n5分前には必ずメインページに行き、スタンバイしてください。おたがいの出席が確認されると、自動でビデオウィンドウが立ち上がります。開始時間10分後までにスタンバイボタンをクリックしないと、欠席とみなされペナルティが発生するので注意してください。また、10分後まで待ったのにパートナーが来なかったという場合には、コインは返却されます。\nメインページURL: http://langchange.org/login.html\n\n★ビデオが立ち上がらない時は\nビデオが立ち上がらない時は、ブラウザによってポップアップがブロックされています。その場合は、ブラウザ上部にあるポップアップの「許可」のボタンを押し、再度メインページを更新して下さい。\n※詳しくは、サイトのトップバーの「よくある質問」に記載されています。\n\n★トークが不安の方へ\n日本語トークは、パートナーと一緒に話してあげるだけで大丈夫です。“何を教えればいいんだろう?”という心配は無用です。一緒にゆっくり話してあげるだけで、パートナーにとっては最高のアウトプットの機会になるはずです。また、サイトのトップバーに「トークのガイド」がございます。トークをスムーズに始め、気持ちよくすすめるためにも、トークの前に一読されるようお願いします。\n\n★iOS（iPhone,iPad）をお使いの方へ\niOSをおつかいの方はビデオ通話に「Appear.in」というアプリの事前ダウンロードが必要です。サイトのトップバーの「つかいかた」のページからダウンロードページへ飛ぶことができます。アプリのダウンロードが事前にされている状態で、お互いの出席が確認されると、メインページから自動でビデオが立ち上がります。ビデオの立ち上がり時にアプリを操作されてしまいますと、相手とうまくつながらない時がございます。その場合は、メインページに戻り、ページの更新を行うと、ビデオが再度自動で立ち上がり、相手とつながります。\n\n※なお、このメールには返信できません";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);

echo "The talk has been booked.";

}else{
	echo "Short of LC coins! Get LC coins by helping English learners.";
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

	echo "You blocked the user.";
 }else{
	echo "You can only block your friends.";
 }
}

?>
