<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");


session_start();

///メール送信 ※初めて使う人へ
if(isset($_POST["sendmail"])){
	//乱数コード生成
	$rnd = substr(base_convert(md5(uniqid()), 16, 36), 0, 10);
	$pdo->query("INSERT INTO temp (code) VALUE ('".$rnd."')");
	
	//メール送信
	$to = $_POST["email"];
	$title = "Langchange登録用メール";
	$content = "Langchangeへご登録、ありがとうございます。\n\n以下のURLから本登録をすることができます。\nその際パスワードを求められますので、以下のコードを入力してください。\n\nパスワード: ". $rnd."\n\n※空白が入らないように気をつけてください\n※このコードは一度しか使えません。万一うまく登録できなかった場合は再度メールアドレスを入力してください。\n\n★本登録URL: http://langchange.org/register-1.html\n\n※なお、このメールには返信できません";
	$from = "From: Langchange<lc_info@langchange.org>";
	mb_language("Japanese");
	mb_internal_encoding("UTF-8");
	mb_send_mail($to, $title, $content, $from);
	
	echo "メールを送信しました";
	
}

///ログイン処理
if(isset($_POST["login"])){
	session_destroy();
	session_start();

	//パスワード認証
	if(!empty($_POST["password"])){
		$pass = $pdo->query("SELECT code FROM temp WHERE code='".$_POST["password"]."'");
		$pass = $pass ->fetch(PDO::FETCH_ASSOC);
		if($pass["code"]!=""){
			//コードを削除 （ワンタイムパスワード処理）
			$pdo->query("DELETE FROM temp WHERE code = '".$pass["code"]."'");

			//セッション取得
			$_SESSION["checkRegister"] = "register-2";

			echo "ok";		
		}else{
			echo "パスワードが間違っています";
		}

	}else{
		echo "パスワードが入力されていません";
	}
}

///確認
if(isset($_POST["name"])) $_SESSION["name"]=$_POST["name"];
if(isset($_POST["country"])) $_SESSION["country"]=$_POST["country"];
if(isset($_POST["mlanguage"])) $_SESSION["mlanguage"]=$_POST["mlanguage"];
if(isset($_POST["sex"])) $_SESSION["sex"]=$_POST["sex"];
if(isset($_POST["birthday"])) $_SESSION["birthday"]=$_POST["birthday"];
if(isset($_POST["college"])) $_SESSION["college"]=$_POST["college"];
if(isset($_POST["nation"])) $_SESSION["nation"]=$_POST["nation"];
if(isset($_POST["hobby"][0])) $_SESSION["hobby"]=$_POST["hobby"];
if(isset($_POST["mail"])){
	//メールアドレスが登録されていないかチェックする
	$query = $pdo->query("SELECT mail FROM users WHERE mail = '".$_POST["mail"]."'");
	$rows = $query->fetch(PDO::FETCH_ASSOC);

	if($rows["mail"]==""){
		$_SESSION["mail"]=$_POST["mail"];
		$_SESSION["ticket"] = 1; //チケットの初期化
	}else{
		echo "このメールアドレスはすでに登録されています";
	}
}
if(isset($_POST["password"])) $_SESSION["password"]=$_POST["password"];
if(isset($_POST["support"])) $_SESSION["support"]=$_POST["support"];

echo "";	

///登録処理
if(isset($_POST["resist"])){

	//セッションIDがなかったら取得
	if(empty($_SESSION["id"])){
		$rnd = substr(base_convert(md5(uniqid()), 16, 36), 0,10);
		$_SESSION["id"] = "lang-".$rnd."-".date('iYdsm');
	}
	$image;
		//デフォルトの画像取得
	if($_SESSION["sex"]=="男"){
		if($_SESSION["country"]=="日本人")
		$image = "default-man.png";
		else
		$image = "default-foeign-man.png";
	}else if($_SESSION["sex"]=="女"){
		if($_SESSION["country"]=="日本人")
		$image = "default-woman.png";
		else
		$image = "default-foeign-woman.png";
	}
	$hobby="";
	foreach($_SESSION["hobby"] as $value){
		$hobby .= $value."_";
	}


//echo "INSERT INTO users(id,name,image,sex,birthday,college,support,mlanguage,hobby,nation,mail,password,ticket,country,serching) VALUES('".$_SESSION["id"]."','".$_SESSION["name"]."','".$image."','".$_SESSION["sex"]."','".$_SESSION["birthday"]."','".$_SESSION["college"]."','".$_SESSION["support"]."','".$_SESSION["mlanguage"]."','".$hobby."','".$_SESSION["nation"].	"','".$_SESSION["mail"]."','".$_SESSION["password"]."',".$_SESSION["ticket"].",'".$_SESSION["country"]."',5)";
	
	$pdo->query("INSERT INTO users(id,name,image,sex,birthday,college,support,mlanguage,hobby,nation,mail,password,ticket,country,serching) VALUES('".$_SESSION["id"]."','".$_SESSION["name"]."','".$image."','".$_SESSION["sex"]."','".$_SESSION["birthday"]."','".$_SESSION["college"]."','".$_SESSION["support"]."','".$_SESSION["mlanguage"]."','".$hobby."','".$_SESSION["nation"].	"','".$_SESSION["mail"]."','".$_SESSION["password"]."',".$_SESSION["ticket"].",'".$_SESSION["country"]."',5)");
//$aaa = $pdo->errorInfo();
//echo $aaa[2];
	//システムを利用する準備
	$idtmp = $_SESSION["id"];
	$nametmp = $_SESSION["name"];
	$nationtmp = $_SESSION["nation"];
	$countrytmp = $_SESSION["country"];
	
	session_destroy();
	session_start();
	$_SESSION["id"] = $idtmp;
	$_SESSION["name"] = $nametmp;
	$_SESSION["ticket"] = 1;
	$_SESSION["friends"] = 0;
	$_SESSION["image"] = $image;
	$_SESSION["country"] = $countrytmp;	
	


	echo "";

}

///紹介者コード登録
if(isset($_POST["resistCode"])){
	$query = $pdo->query("SELECT id,ticket,invticket FROM users WHERE id = '".$_POST["inviteCode"]."'");
	$rows = $query->fetch(PDO::FETCH_ASSOC);

	if(empty($_SESSION["check"])){
		if(!empty($rows["id"])){
			//相手のチケット増やす
			$rows["ticket"] += 1;
			$rows["invticket"] += 1;
			$pdo->query("UPDATE users SET ticket = ".$rows["ticket"].",invticket = ".$rows["invticket"]." WHERE id = '".$rows["id"]."'");
			//自分のチケット増やす
			$_SESSION["ticket"] += 1;

			$_SESSION["check"] = "c";	
		
			echo "紹介コードを登録しました";
		}else{
			echo "紹介コードが間違えています";
		}
	}else{
		echo "登録は一回までです";
	}
}

///紹介コード確認
if(isset($_POST["checkInvitation"])){
	echo $_SESSION["invitation"];
}

///セッションをチェック
if(isset($_POST["register3"])) $_SESSION["checkRegister"] = "register-3";
if(isset($_POST["register4"])) $_SESSION["checkRegister"] = "register-4";
if(isset($_POST["register5"])) $_SESSION["checkRegister"] = "register-5";


if(isset($_POST["check"]))
echo $_SESSION["checkRegister"];


?>
