<?php
//facebookSDKを読み込み
require_once("facebook.php");
include("connectDB.php");

//アプリの情報を$configに格納
$config = array(
    'appId' => "1513109692251737",
    'secret' => "05e6ab831200a816a07eb4df3ae03513"
);
 
$facebook = new Facebook($config);
$user = $facebook->getUser();
//もしユーザがフェイスブックにログインしていたら
if ( $user ) {
	$query = $pdo->query("SELECT name,image,nation,sex,birthday,hobby,ticket,country FROM users WHERE id = '".$user."'");
	$rows=$query->fetch(PDO::FETCH_ASSOC);
	$_SESSION["country"]=$rows["country"]; //日本人・外国人の振り分け;
	//langchangeに登録していたら	
	if($rows["name"]!=""){
		//セッションデータを取得
		session_start();
		$_SESSION["id"] = $user;
		$_SESSION["name"] = $rows["name"];
		$_SESSION["image"] = $rows["image"];
		$_SESSION["ticket"] = $rows["ticket"];
		$_SESSION["nation"] = $rows['nation'];
		$_SESSION["sex"] = $rows['sex'];
		$_SESSION["birthday"] = $rows['birthday'];
		$_SESSION["hobby"] = $rows['hobby'];
		//友達の人数を取得
		$passtmp = $pdo->query("SELECT count(friend.id) friends FROM friend WHERE userid='".$_SESSION["id"]."'");
		$passtmp = $passtmp ->fetch(PDO::FETCH_ASSOC);
		$_SESSION["friends"] = $passtmp['friends'];
		//退会登録ページへりダイレクト
		if(isset($_SESSION["exit"])){
			$redirect='../leave.html';
			header('Location:'.$redirect);
			exit;
		}
		//メインページへりダイレクト
		if($_SESSION["country"]=="日本人")
		$redirect='http://langchange.org/mainpage.html';
    		else
		$redirect='http://langchange.org/english/mainpage.html';

		header('Location:'.$redirect);
    		exit;
	}else{
	//登録してなかったら登録画面へ
		session_destroy();
		session_start();
		$_SESSION["checkRegister"] = "register-2";
		$_SESSION["id"] = $user;

		//自動入力用
		$user_profile = $facebook->api('/me','GET');
		$_SESSION["name"] = $user_profile['name'];
		$_SESSION["image"] = "https://graph.facebook.com/".$user."/picture";
		$_SESSION["mail"] = $user_profile['email'];

    		$redirect='../register-2.html';
    		header('Location:'.$redirect);
    		exit;
	}
} else { //ログインしてなかったらログイン
    $params = array('scope' => 'email');
    $loginUrl = $facebook->getLoginUrl($params);
    header('Location:'.$loginUrl);
    exit;
}
?>
