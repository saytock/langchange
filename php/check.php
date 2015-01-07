<?php
	session_start();

//言語変更ボタンを押したらセッションをリセット
if(isset($_POST["changeLangage"]))
session_destroy();

//セッション情報がなければログインページへ
if(isset($_POST["check"])){
	if(empty($_SESSION["id"]))
	echo "gotoLogin";
	else if($_SESSION["country"]=="外国人")
	echo "gotoEnglish";
}

//セッション情報があればそのままメインページへ
if(isset($_POST["checkSession"])){
//echo "id:".$_SESSION["id"];
//echo "country:".$_SESSION["country"];
	if(isset($_SESSION["id"])){
		if($_SESSION["country"]=="日本人")
		echo "japanese";
		else if($_SESSION["country"]=="外国人")
		echo "english";		
	}else{
		echo "";
	}
}	
?>
