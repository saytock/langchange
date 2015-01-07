<?php
header("Content-type:text/plain;charset=UTF-8");
include("connectDB.php");
 

//セッションを始める
session_start();


//ログイン
if(isset($_POST['login'])){
	//idおよびpasswordが入力されてるか	
	if(!empty($_POST['id']) && !empty($_POST['password'])){

		//変数の値を取得
		$id = $_POST['id'];
		$password = $_POST['password'];

		//idからパスワードを検索
		$passtmp = $pdo->query("SELECT id,image,name,nation,sex,birthday,hobby,password,ticket,country FROM users WHERE mail='".$id."'");
		
		//結果を配列形式に変換
		$passtmp = $passtmp ->fetch(PDO::FETCH_ASSOC);
		$_SESSION["country"] = $passtmp["country"]; //日本人・外国人の情報		

		//認証処理
		if($passtmp["password"] == $password){

		//ユーザー名をセッション証明として取得
		$_SESSION["id"] = $passtmp['id'];
		$_SESSION["name"] = $passtmp['name'];
		$_SESSION["ticket"] = $passtmp['ticket'];
		$_SESSION["image"] = $passtmp['image'];
		$_SESSION["nation"] = $passtmp['nation'];
		$_SESSION["sex"] = $passtmp['sex'];
		$_SESSION["birthday"] = $passtmp['birthday'];
		$_SESSION["hobby"] = $passtmp['hobby'];

		//友達の人数を取得
		$passtmp = $pdo->query("SELECT count(friend.id) friends FROM friend WHERE userid='".$_SESSION["id"]."'");
		$passtmp = $passtmp ->fetch(PDO::FETCH_ASSOC);
		$_SESSION["friends"] = $passtmp['friends'];	
		
			if(isset($_SESSION["exit"])){
				echo "gotoExit";
			}else{	
				if($_SESSION["country"] == "日本人")
				echo "japanese";
				else
				echo "english";
			}			
		}else{
			echo "IDかパスワードが間違っています";
		}	
	}else{
		echo "IDとパスワードを入力してください";
	}
}

//ログアウト
if(isset($_POST['logout'])){
	session_destroy();
	echo "ok";
}

?>
