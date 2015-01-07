<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");

session_start();
///メール送信 ※初めて使う人へ
if(isset($_POST["sendmail"])){
	//乱数コード生成
	$rnd = substr(base_convert(md5(uniqid()), 16, 36), 0, 10);
	$pdo->query("INSERT INTO temp (code,mail) VALUE ('".$rnd."','".$_POST["mail"]."')");
	
	//メール送信
	$to = $_POST["mail"];
	$title = "Langchangeパスワード変更";
	$content = "以下のURLからパスワードを変更することができます。\nその際パスワードを求められますので、以下のコードを入力してください。\n\nコード: ". $rnd."\n\n※空白が入らないように気をつけてください\n※このコードは一度しか使えません。万一うまく認証できなかった場合は再度メールアドレスを入力してください。\n\n★パスワード変更 URL: http://langchange.org/reset-2.html\n\n※なお、このメールには返信できません";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);
	
	echo "メールを送信しました";
	
}

///ログイン処理
if(isset($_POST["login"])){
	//パスワード認証
	if(!empty($_POST["password"])){
		$pass = $pdo->query("SELECT code,mail FROM temp WHERE code='".$_POST["password"]."'");
		$pass = $pass->fetch(PDO::FETCH_ASSOC);
		
		if($pass["code"]!=""){
			//コードを削除 （ワンタイムパスワード処理）
			$pdo->query("DELETE FROM temp WHERE code = '".$pass["code"]."'");
			$_SESSION["mail"] = $pass["mail"];	

			$_SESSION["checkReset"] = "reset-3";
	
			echo "ok";		
		}else{
			echo "パスワードが間違えています";
		}

	}else{
		echo "パスワードが入力されていません";
	}
}

///登録処理
if(isset($_POST["resist"])){
	$query = $pdo->query("SELECT id,name,nation,sex,birthday,hobby,ticket,image FROM users WHERE mail='".$_SESSION["mail"]."'");
	$rows = $query->fetch(PDO::FETCH_ASSOC);

	$pdo->query("UPDATE users SET password='".$_POST["password"]."' WHERE id='".$rows["id"]."'");
$aaa = $pdo->errorInfo();
echo $aaa[2];
	//システムを利用する準備
	session_destroy();
	session_start();
	$_SESSION["id"] = $rows["id"];
	$_SESSION["name"] = $rows["name"];
	$_SESSION["ticket"] = $rows["ticket"];
	$_SESSION["image"] = $rows["image"];
	$_SESSION["nation"] = $rows["nation"];
	$_SESSION["sex"] = $rows["sex"];
	$_SESSION["birthday"] = $rows["birthday"];
	$_SESSION["hobby"] = $rows["hobby"];
	
	//友達の人数を取得
	$passtmp = $pdo->query("SELECT count(friend.id) friends FROM friend WHERE userid='".$_SESSION["id"]."'");
	$passtmp = $passtmp ->fetch(PDO::FETCH_ASSOC);
	$_SESSION["friends"] = $passtmp['friends'];

	echo "";

}

///セッションをチェック
if(isset($_POST["reset4"])) $_SESSION["checkReset"] = "reset-4";


if(isset($_POST["check"]))
echo $_SESSION["checkReset"];


?>
