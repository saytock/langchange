<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");
//セッションを始める
session_start();


///初期化
if(isset($_POST["init"])){
$tmp = "";
//受ける予定を取得
$query = $pdo->query("SELECT learning,name,friendid FROM learning,users WHERE userid = '".$_SESSION["id"]."' && learningyear = '".$_POST["year"]."' && learning LIKE '".$_POST["month"]."月%' && users.id = friendid");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp = $tmp.$rows["learning"]."  (<div class=\"profile-link\" id=\"".$rows["friendid"]."\" style=\"display:inline-block;cursor:pointer\" onclick=\"getProfile(this)\"> ".$rows["name"]."さん</div>) <英語>,";
	}

//教える予定を取得
$query = $pdo->query("SELECT teaching,name,friendid FROM teaching,users WHERE userid = '".$_SESSION["id"]."' && checks IS NOT NULL && teachingyear = '".$_POST["year"]."' && teaching LIKE '".$_POST["month"]."月%' && users.id = friendid");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp = $tmp.$rows["teaching"]."  (<div class=\"profile-link\" id=\"".$rows["friendid"]."\" style=\"display:inline-block;cursor:pointer\" onclick=\"getProfile(this)\"> ".$rows["name"]."さん</div>) <日本語>,";
	}

//教える予定を取得 （マッチングされてないやつ)
$query = $pdo->query("SELECT teaching FROM teaching WHERE userid = '".$_SESSION["id"]."' && checks IS NULL && teachingyear = '".$_POST["year"]."' && teaching LIKE '".$_POST["month"]."月%'");
	while($rows=$query->fetch(PDO::FETCH_ASSOC)){
		$tmp = $tmp.$rows["teaching"]." (マッチング待ち) <日本語>,";
	}


echo $tmp;
}


///相手のスタンバイを確認
if(isset($_POST["checkStanby"])){
	//自分のチケットを増やす
	if($_POST["talktype"]=="teaching"){
		//チケットを増やす
		$myticket=$pdo->query("SELECT ticket FROM users WHERE id = '".$_SESSION["id"]."'");
		$myticketArray=$myticket->fetch(PDO::FETCH_ASSOC);
		$pdo->query("UPDATE users SET ticket = ".($myticketArray["ticket"]+2)." WHERE id = '".$_SESSION["id"]."'");
		echo "相手が時間内にスタンバイしませんでした\n\nあなたはLCコインを2枚獲得しました";
	}else{
		//チケットを増やす
		$myticket=$pdo->query("SELECT ticket FROM users WHERE id = '".$_SESSION["id"]."'");
		$myticketArray=$myticket->fetch(PDO::FETCH_ASSOC);
		$pdo->query("UPDATE users SET ticket = ".($myticketArray["ticket"]+3)." WHERE id = '".$_SESSION["id"]."'");
		echo "相手が時間内にスタンバイしませんでした\n\nあなたはLCコインを3枚獲得しました";
	}


}

?>
